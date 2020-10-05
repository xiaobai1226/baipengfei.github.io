---
title: 面向对象五大原则-----里氏代换原则
date: 2018-03-29 10:38:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./srp
next: ./dip
---

**什么是里氏代换原则**  
&emsp;&emsp;里氏代换原则(Liskov Substitution Principle LSP)面向对象设计的基本原则之一。 里氏代换原则中说，任何基类可以出现的地方，子类一定可以出现。 LSP是继承复用的基石，只有当衍生类可以替换掉基类，软件单位的功能不受到影响时，基类才能真正被复用，而衍生类也能够在基类的基础上增加新的行为。里氏代换原则是对“开-闭”原则的补充。实现“开-闭”原则的关键步骤就是抽象化。而基类与子类的继承关系就是抽象化的具体实现，所以里氏代换原则是对实现抽象化的具体步骤的规范。  
&emsp;&emsp;简单的理解为一个软件实体如果使用的是一个父类，那么一定适用于其子类，而且它察觉不出父类对象和子类对象的区别。也就是说，软件里面，把父类都替换成它的子类，程序的行为没有变化。  
&emsp;&emsp;但是反过来的代换却不成立，里氏代换原则(Liskov Substitution Principle)：一个软件实体如果使用的是一个子类的话，那么它不能适用于其父类。  

举个例子解释一下这个概念，先创建一个Person类
``` java
public class Person {
    public void display() {
        System.out.println("this is person");
    }
}
```

再创建一个Man类，继承这个Person类
``` java
public class Man extends Person {

    public void display() {
        System.out.println("this is man");
    }
    
}
```

运行一下
``` java
public class MainClass {
    public static void main(String[] args) {
        Person person = new Person();//new一个Person实例
        display(person);
        
        Person man = new Man();//new一个Man实例
        display(man);
    }
    
    public static void display(Person person) {
        person.display();
    }
}
```
可以看到  
<font color=#0099ff size=3 face="黑体">this is person</font>  
<font color=#0099ff size=3 face="黑体">this is man</font>  

&emsp;&emsp;运行没有影响，符合一个软件实体如果使用的是一个父类的话，那么一定适用于其子类，而且它察觉不出父类和子类对象的区别这句概念，这也就是java中的多态。  

而反之，一个子类的话，那么它不能适用于其父类，这样，程序就会报错
``` java
public class MainClass {
    public static void main(String[] args) {
        Person person = new Person();
        display(person);//这里报错
        
        Man man = new Man();
        display(man);
    }
    
    public static void display(Man man) {//传入一个子类
        man.display();
    }
}
```
 
继续再举一个很经典的例子，正方形与长方形是否符合里氏代换原则，也就是说正方形是否是长方形的一个子类。  
以前，我们上学都说正方形是特殊的长方形，是宽高相等的长方形，所以我们认为正方形是长方形的子类，但真的是这样吗？  
![里氏代换原则](/img/blogs/2018/03/lsp1.png)  
从图中，我们可以看到长方形有两个属性宽和高，而正方形则只有一个属性边长。  

所以，用代码如此实现
``` java
//长方形
public class Changfangxing{
    private long width;
    private long height;
    
    public long getWidth() {
        return width;
    }
    public void setWidth(long width) {
        this.width = width;
    }
    public long getHeight() {
        return height;
    }
    public void setHeight(long height) {
        this.height = height;
    }
}

//正方形
public class Zhengfangxing{
    private long side;

    public long getSide() {
        return side;
    }

    public void setSide(long side) {
        this.side = side;
    }
}
```
可以看到，它们的结构根本不同，所以正方形不是长方形的子类，所以长方形与正方形之间并不符合里氏代换原则。  

当然我们也可以强行让正方形继承长方形
``` java
//正方形
public class Zhengfangxing extends Changfangixng{
    private long side;

    public long getHeight() {
        return this.getSide();
    }

    public long getWidth() {
        return this.getSide();
    }

    public void setHeight(long height) {
        this.setSide(height);
    }

    public void setWidth(long width) {
        this.setSide(width);
    }

    public long getSide() {
        return side;
    }

    public void setSide(long side) {
        this.side = side;
    }
}
```
这个样子，编译器是可以通过的，也可以正常使用，但是这样就符合里氏代换原则了吗，肯定不是的。  
我们不是为了继承而继承，只有真正符合继承条件的情况下我们才去继承，所以像这样为了继承而继承，强行实现继承关系的情况也是不符合里氏代换原则的。  

但这是为什么呢？，我们运行一下
``` java
public class MainClass {
    public static void main(String[] args) {
        Changfangxing changfangxing = new Changfangxing();
        changfangxing.setHeight(10);
        changfangxing.setWidth(20);
        test(changfangxing);
        
        Changfangxing zhengfangxing = new Zhengfangxing();
        zhengfangxing.setHeight(10);
        test(zhengfangxing);
    }
    
    public static void test(Changfangxing changfangxing) {
        System.out.println(changfangxing.getHeight());
        System.out.println(changfangixng.getWidth());
    }
}
```
结果：  
<font color=#0099ff size=3 face="黑体">10</font>  
<font color=#0099ff size=3 face="黑体">20</font>  
<font color=#0099ff size=3 face="黑体">10</font>  
<font color=#0099ff size=3 face="黑体">10</font>  

我们忽然发现，很正常啊，为什么不可以，但是我们继续修改
``` java
public class MainClass {
    public static void main(String[] args) {
        Changfangxing changfangxing = new Changfangxing();
        changfangxing.setHeight(10);
        changfangxing.setWidth(20);
        resize(changfangxing);
        
        Changfangxing zhengfangxing = new Zhengfangxing();
        zhengfangxing.setHeight(10);
        resize(zhengfangxing);
    }
    
    public static void test(Changfangxing changfangxing) {
        System.out.println(changfangxing.getHeight());
        System.out.println(changfangxing.getWidth());
    }
    
    public static void resize(Changfangxing changfangxing) {
        while(changfangxing.getHeight() <= changfangxing.getWidth()) {
            changfangxing.setHeight(changfangxing.getHeight() + 1);
            test(changfangxing);
        }
    }
}
```
当长方形运行时，可以正常运行，而正方形则会造成死循环，所以这种继承方式不一定恩能够适用于所有情况，所以不符合里氏代换原则。

还有一种形式，我们抽象出一个四边形接口，让长方形和正方形都实现这个接口
``` java
public interface Sibianxing {
    public long getWidth();
    public long getHeight();
}

public class Changfangxing implements Sibianxing{
    private long width;
    private long height;
    
    public long getWidth() {
        return width;
    }
    public void setWidth(long width) {
        this.width = width;
    }
    public long getHeight() {
        return height;
    }
    public void setHeight(long height) {
        this.height = height;
    }
}
```
``` java
package com.ibeifeng.ex3;

public class Zhengfangxing implements Sibianxing{
    private long side;

    public long getHeight() {
        return this.getSide();
    }

    public long getWidth() {
        return this.getSide();
    }

    public void setHeight(long height) {
        this.setSide(height);
    }

    public void setWidth(long width) {
        this.setSide(width);
    }

    public long getSide() {
        return side;
    }

    public void setSide(long side) {
        this.side = side;
    }
}
```

运行
``` java
public class MainClass {
    public static void main(String[] args) {
        Changfangxing changfangxing = new Changfangxing();
        changfangxing.setHeight(10);
        changfangxing.setWidth(20);
        test(changfangxing);
        
        Zhengfangxing zhengfangxing = new Zhengfangxing();
        zhengfangxing.setHeight(10);
        test(zhengfangxing);
    }
    
    public static void test(Sibianxing sibianxing) {
        System.out.println(sibianxing.getHeight());
        System.out.println(sibianxing.getWidth());
    }
}
```
&emsp;&emsp;对于长方形和正方形，取width和height是它们共同的行为，但是给width和height赋值，两者行为不同，因此，这个抽象的四边形的类只有取值方法，没有赋值方法。上面的例子中那个方法只会适用于不同的子类，LSP也就不会被破坏。

**注意事项**  
&emsp;&emsp;在进行设计的时候，尽量从抽象类继承，而不是从具体类继承。如果从继承等级树来看，所有叶子节点应当是具体类，而所有的树枝节点应当是抽象类或者接口。当然这个只是一个一般性的指导原则，使用的时候还要具体情况具体分析。