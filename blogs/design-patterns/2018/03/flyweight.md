---
title: 设计模式-----10、享元模式
date: 2018-03-13 16:27:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./observer
next: ./proxy
---

&emsp;&emsp;Flyweight模式也叫享元模式，是构造型模式之一，它通过与其他类似对象共享数据来减小内存占用。它使用共享物件，用来尽可能减少内存使用量以及分享资讯给尽可能多的相似物件；它适合用于只是因重复而导致使用无法令人接受的大量内存的大量物件。通常物件中的部分状态是可以分享。常见做法是把它们放在外部数据结构，当需要使用时再将它们传递给享元。　
![享元模式](/img/blogs/2018/03/flyweight.png)

**享元模式的角色和职责：**
1. 抽象享元角色：为具体享元角色规定了必须实现的方法，而外蕴状态就是以参数的形式通过此方法传入。在Java中可以由抽象类、接口来担当。
2. 具体享元角色：实现抽象角色规定的方法。如果存在内蕴状态，就负责为内蕴状态提供存储空间。
3. 享元工厂角色：负责创建和管理享元角色。要想达到共享的目的，这个角色的实现是关键。
4. 客户端角色：维护对所有享元对象的引用，而且还需要存储对应的外蕴状态。
            
**两个状态：**
1. 内蕴状态存储在享元内部，不会随环境的改变而有所不同，是可以共享的
2. 外蕴状态是不可以共享的，它随环境的改变而改变的，因此外蕴状态是由客户端来保持（因为环境的变化是由客户端引起的）。

下面举个小例子  
首先，创建一个抽象享元角色
``` java
public interface Flyweight {
    public void display();
}
```

接着，创建具体享元角色
``` java
public class MyFlyweight implements Flyweight{
    private String str;
    
    public MyFlyweight(String str){
        this.str = str;
    }
    
    public void display(){
        System.out.println(str);
    }
}　　
```

如果，不使用享元模式的话，不创建享元工厂，直接，创建客户端，代码如下：
``` java
public class MainClass {
    public static void main(String[] args) {
        Flyweight myFlyweight1 = new MyFlyweight("a");
        Flyweight myFlyweight2 = new MyFlyweight("b");
        Flyweight myFlyweight3 = new MyFlyweight("a");
        Flyweight myFlyweight4 = new MyFlyweight("d");
        
        myFlyweight1.display();
        myFlyweight2.display();
        myFlyweight3.display();
        myFlyweight4.display();
        
        System.out.println(myFlyweight1 == myFlyweight3);
    }
}
```
这样子，运行结果为：  
<font color=#0099ff size=3 face="黑体">a</font>  
<font color=#0099ff size=3 face="黑体">b</font>  
<font color=#0099ff size=3 face="黑体">a</font>  
<font color=#0099ff size=3 face="黑体">d</font>  
<font color=#0099ff size=3 face="黑体">false</font>  

这样子，可以看到，第一个与第三个明明都是a，但却不是同一个对象，说明虽然对象内部一模一样，但却创建了两个对象，这样就浪费了资源。

如果用到享元模式，继续创建享元工厂
``` java
public class MyFlyweightFactory {
    private Map<String,MyFlyweight> pool;
    
    public MyFlyweightFactory(){
        pool = new HashMap<String,MyFlyweight>();
    }
    
    public Flyweight getMyFlyweight(String str){
        MyFlyweight myFlyweight = pool.get(str);
        
        //若池中没有则创建一个新的并放入池中，若池中已存在，则返回池中的
        if(myFlyweight == null){
            myFlyweight = new MyFlyweight(str);
            pool.put(str, myFlyweight);
        }
        
        return myFlyweight;
    }
}
```

这样，修改客户端
``` java
public class MainClass {
    public static void main(String[] args) {
        MyFlyweightFactory myFlyweightFactory = new MyFlyweightFactory();
        Flyweight myFlyweight1 = myFlyweightFactory.getMyFlyweight("a");
        Flyweight myFlyweight2 = myFlyweightFactory.getMyFlyweight("b");
        Flyweight myFlyweight3 = myFlyweightFactory.getMyFlyweight("a");
        Flyweight myFlyweight4 = myFlyweightFactory.getMyFlyweight("d");
        
        myFlyweight1.display();
        myFlyweight2.display();
        myFlyweight3.display();
        myFlyweight4.display();
         
        System.out.println(myFlyweight1 == myFlyweight3);
    }
}
```
此时，结果就变为了  
<font color=#0099ff size=3 face="黑体">a</font>  
<font color=#0099ff size=3 face="黑体">b</font>  
<font color=#0099ff size=3 face="黑体">a</font>  
<font color=#0099ff size=3 face="黑体">d</font>  
<font color=#0099ff size=3 face="黑体">true</font>  

可以看到，第一个与第三个变为了同一个对象，一模一样的对象只创建一次，节约了资源，这样，享元模式的作用就达到了。

**使用场景**  
&emsp;&emsp;如果一个应用程序使用了大量的对象，而这些对象造成了很大的存储开销的时候就可以考虑是否可以使用享元模式。  
例如,如果发现某个对象的生成了大量细粒度的实例，并且这些实例除了几个参数外基本是相同的，如果把那些共享参数移到类外面，在方法调用时将他们传递进来，就可以通过共享大幅度降低单个实例的数目。