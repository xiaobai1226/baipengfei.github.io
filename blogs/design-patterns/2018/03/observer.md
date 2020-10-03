---
title: Java设计模式-----9、观察者模式
date: 2018-03-09
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./strategy
next: ./flyweight
---

Observer模式是行为模式之一，它的作用是当一个对象的状态发生变化时，能够自动通知其他关联对象，自动刷新对象状态。  
Observer模式提供给关联对象一种同步通信的手段，使某个对象与依赖它的其他对象之间保持状态同步。

观察者模式的结构：
![观察者模式结构图](/img/blogs/2018/03/observer-structure.png)

**观察者模式的角色和职责：**  
**1. Subject（被观察者）**  
被观察的对象。当需要被观察的状态发生变化时，需要通知队列中所有观察者对象。Subject需要维持（添加，删除，通知）一个观察者对象的队列列表。  
**2. ConcreteSubject**  
被观察者的具体实现。包含一些基本的属性状态及其他操作。  
**3. Observer（观察者）**  
接口或抽象类。当Subject的状态发生变化时，Observer对象将通过一个callback函数得到通知。  
**4. ConcreteObserver**  
观察者的具体实现。得到通知后将完成一些具体的业务逻辑处理。

而被观察者想要起作用，就必须继承java.util包下的Observable类，这是它的方法，后面会有介绍  
|构造方法|描述|
|-|-|
|Observable()|构造一个带有零个观察者的 Observable。|

|方法|返回类型|描述|
|-|-|-|
|addObserver(Observer o)|void|如果观察者与集合中已有的观察者不同，则向对象的观察者集中添加此观察者。|
|clearChanged()|protected void|指示对象不再改变，或者它已对其所有的观察者通知了最近的改变，所以 hasChanged 方法将返回 false。|
|countObservers()|int|返回 Observable 对象的观察者数目。|
|deleteObserver(Observer o)|void|从对象的观察者集合中删除某个观察者。|
|deleteObservers()|void|清除观察者列表，使此对象不再有任何观察者。|
|hasChanged()|boolean|测试对象是否改变。|
|notifyObservers()|void|如果 hasChanged 方法指示对象已改变，则通知其所有观察者，并调用 clearChanged 方法来指示此对象不再改变。|
|notifyObservers(Object arg)|void|如果 hasChanged 方法指示对象已改变，则通知其所有观察者，并调用 clearChanged 方法来指示此对象不再改变。|
|setChanged()|protected void|标记此 Observable 对象为已改变的对象；现在 hasChanged 方法将返回 true。|
 
下面写一个例子：新建一个Person类
``` java
public class Person {
    private String name;
    private String sex;
    private int age;
    
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getSex() {
        return sex;
    }
    public void setSex(String sex) {
        this.sex = sex;
    }
    public int getAge() {
        return age;
    }
    public void setAge(int age) {
        this.age = age;
    }
}
```
 
我们要做的就是监听成员变量name，sex，age的变化，在数值变化时，执行我们的操作，所以Person就是被观察者，所以server必须继承Observable，而Observable中有这三个方法：
1. notifyObservers() ： 如果 hasChanged 方法指示对象已改变，则通知其所有观察者，并调用 clearChanged 方法来指示此对象不再改变。这个方法是通知观察者被观察者是否改变的，只要hasChanged()方法指示的对象改变，就会调用观察者中的方法。
2. hasChanged() ： 测试对象是否改变。
3. setChanged() ：标记此 Observable 对象为已改变的对象；现在 hasChanged 方法将返回 true。  

所以，如果想观察成员变量是否改变，就要在set方法中执行setChanged()与notifyObservers()  

被观察者应该改为：
``` java
import java.util.Observable;

public class Person extends Observable{
    private String name;
    private String sex;
    private int age;
    
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
        this.setChanged();
        this.notifyObservers();
    }
    public String getSex() {
        return sex;
    }
    public void setSex(String sex) {
        this.sex = sex;
        this.setChanged();
        this.notifyObservers();
    }
    public int getAge() {
        return age;
    }
    public void setAge(int age) {
        this.age = age;
        this.setChanged();
        this.notifyObservers();
    }
}
```

有了被观察者，就要有观察者，观察者必须实现java.util包下的Observer接口，并重写update(Observable o, Object arg)方法，当被观察者改变时，就会执行update()方法
``` java
import java.util.Observable;
import java.util.Observer;

public class MyObserver implements Observer {

    @Override
    public void update(Observable o, Object arg) {
        System.out.println("对象已改变");
    }

}
```

现在，就可以执行看一看了。不过在执行set()方法之前一定要使用addObserver(Observer o) 这个方法注册观察者，不然不会生效。
``` java
public class MainClass {
    public static void main(String[] args) {
        Person person = new Person();
        //注册观察者
        person.addObserver(new MyObserver());
        person.setName("小明");
        person.setSex("男");
        person.setAge(18);
    }
}
```

输出结果是这样的：  
<font color=#0099ff size=3 face="黑体">对象已改变</font>  
<font color=#0099ff size=3 face="黑体">对象已改变</font>  
<font color=#0099ff size=3 face="黑体">对象已改变</font>  

同时，notifyObservers()为什么是s结尾呢，因为我们可以同时注册多个观察者，这样写
``` java
public class MainClass {
    public static void main(String[] args) {
        Person person = new Person();
        //注册观察者
        person.addObserver(new MyObserver());
        person.addObserver(new MyObserver());
        
        person.setName("小明");
        person.setSex("男");
        person.setAge(18);
    }
}
```

我们注册两个观察者，两个都会生效，结果就变为了：  
<font color=#0099ff size=3 face="黑体">对象已改变</font>  
<font color=#0099ff size=3 face="黑体">对象已改变</font>  
<font color=#0099ff size=3 face="黑体">对象已改变</font>  
<font color=#0099ff size=3 face="黑体">对象已改变</font>  
<font color=#0099ff size=3 face="黑体">对象已改变</font>  
<font color=#0099ff size=3 face="黑体">对象已改变</font>  

还有三个方法deleteObserver(Observer o) ，deleteObservers() ，countObservers() 
``` java
public class MainClass {
    public static void main(String[] args) {
        Person person = new Person();
        //注册观察者
        MyObserver myObserver = new MyObserver();
        person.addObserver(myObserver);
        person.addObserver(new MyObserver());
        //获得当前对象已注册的观察者数目
        person.countObservers();
        //删除指定的一个观察者
        person.deleteObserver(myObserver);
        //删除该对象全部观察者
        person.deleteObservers();
        
        person.setName("小明");
        person.setSex("男");
        person.setAge(18);
    }
}
```

**观察者模式的典型应用：**
1. 侦听事件驱动程序设计中的外部事件
2. 侦听/监视某个对象的状态变化
3. 发布者/订阅者(publisher/subscriber)模型中，当一个外部事件（新的产品，消息的出现等等）被触发时，通知邮件列表中的订阅者