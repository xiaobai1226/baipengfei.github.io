---
title: 设计模式-----2、工厂方法模式
date: 2018-02-28 14:09:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./simple-factory
next: ./abstract-factory
---

&emsp;&emsp;再看工厂方法模式之前先看看[简单工厂模式](simple-factory.md)。  
&emsp;&emsp;工厂方法模式（FACTORY METHOD）同样属于一种常用的对象创建型设计模式，又称为多态工厂模式,此模式的核心精神是封装类中不变的部分，提取其中个性化善变的部分为独立类，通过依赖注入以达到解耦、复用和方便后期维护拓展的目的。它的核心结构有四个角色，分别是抽象工厂，具体工厂，抽象产品，具体产品。  
&emsp;&emsp;工厂方法(Factory Method)模式的意义是定义一个创建产品对象的工厂接口，将实际创建工作推迟到子类当中。核心工厂类不再负责产品的创建，这样核心类成为一个抽象工厂角色，仅负责具体工厂子类必须实现的接口，这样进一步抽象化的好处是使得工厂方法模式可以使系统在不修改具体工厂角色的情况下引进新的产品。  
&emsp;&emsp;工厂方法模式是简单工厂模式的衍生，解决了许多简单工厂模式的问题。首先完全实现‘开－闭 原则’，实现了可扩展。其次更复杂的层次结构，可以应用于产品结果复杂的场合。  
&emsp;&emsp;工厂方法模式对简单工厂模式进行了抽象。有一个抽象的Factory类（可以是抽象类和接口），这个类将不再负责具体的产品生产，而是只制定一些规范，具体的生产工作由其子类去完成。在这个模式中，工厂类和产品类往往可以依次对应。即一个抽象工厂对应一个抽象产品，一个具体工厂对应一个具体产品，这个具体的工厂就负责生产对应的产品。  
&emsp;&emsp;工厂方法模式(Factory Method pattern)是最典型的模板方法模式(Template Method pattern)应用。  
&emsp;&emsp;在上一篇[简单工厂模式](simple-factory.md)中，我们有两个具体产品，Apple与Banana，如果我们要增加新的具体工厂时。我们就需要修改已经写好的工厂。像这样
``` java
public class Pear implements Fruit{  //具体产品
    @Override
    public void get() {
        System.out.println("采集梨子");
    }
}
```
``` java
public class FruitFactory { //工厂
    public static Fruit getFruit(String type) throws InstantiationException, IllegalAccessException{
        //不区分大小写
        if(type.equalsIgnoreCase("Apple")){
            return Apple.class.newInstance();
        }else if(type.equalsIgnoreCase("Banana")){
            return Banana.class.newInstance();
        }else if(type.equalsIgnoreCase("Pear")){
            return Pear.class.newInstance();
        }else{
            System.out.println("找不到相应的实体类");
            return null;
        }
    }
}
```
``` java
public class MainClass {
    public static void main(String[] args) throws InstantiationException, IllegalAccessException, ClassNotFoundException {
         //实例化一个Apple，用到了工厂类
        Fruit apple = FruitFactory.getFruit("apple");
        //实例化一个Banana，用到了工厂类
        Fruit banana= FruitFactory.getFruit("banana");
        //实例化一个Pear，用到了工厂类
        Fruit pear= FruitFactory.getFruit("pear");
        apple.get();
        banana.get();
        pear.get();
    }
}
```
可以看到，这样子，只要增加具体产品时，我们就要修改具体工厂，这样子并不符合开放-封闭原则。  
所以，根据工厂方法模式我们创建一个抽象工厂
``` java
public interface FruitFactory {
    public Fruit getFruit();
}
```
然后再创建相应的具体工厂实现抽象工厂
``` java
public class AppleFactory implements FruitFactory {
    @Override
    public Fruit getFruit() {
        return new Apple();
    }
}
```
``` java
public class BananaFactory implements FruitFactory {
    @Override
    public Fruit getFruit() {
        return new Banana();
    }
}
```
主方法
``` java
public class MainClass {
    public static void main(String[] args) throws InstantiationException, IllegalAccessException, ClassNotFoundException {
        //获得AppleFactory
        FruitFactory af = new AppleFactory();
        //通过AppleFactory来获得Apple实例对象
        Fruit apple = af.getFruit();
        apple.get();
        
        //获得BananaFactory
        FruitFactory bf = new BananaFactory();
        //通过BananaFactory来获得Apple实例对象
        Fruit banana = bf.getFruit();
        banana.get();
    }
}
```
可以看到，工厂方法模式，如果要新增具体产品，根本不必动原有工厂代码，只要新建一个新增产品的专属工厂，并实现抽象工厂即可。  

**工厂方法模式中包含的角色及其职责：**  
1. 抽象工厂(Creator)角色：（FruitFactory）  
是工厂方法模式的核心，与应用程序无关。任何在模式中创建的对象的工厂类必须实现这个接口。
2. 具体工厂(Concrete Creator)角色：（AppleFactory、BananaFactory）  
这是实现抽象工厂接口的具体工厂类，包含与应用程序密切相关的逻辑，并且受到应用程序调用以创建产品对象。在上图中有两个这样的角色：BulbCreator与TubeCreator。
3. 抽象产品(Product)角色：（Fruit）  
工厂方法模式所创建的对象的超类型，也就是产品对象的共同父类或共同拥有的接口。在上图中，这个角色是Light。
4. 具体产品(Concrete Product)角色：（Apple、Banana）  
这个角色实现了抽象产品角色所定义的接口。某具体产品有专门的具体工厂创建，它们之间往往一一对应。

**工厂方法模式与简单工厂模式比较：**
1. 工厂方法模式与简单工厂模式在结构上的不同不是很明显。工厂方法类的核心是一个抽象工厂类，而简单工厂模式把核心放在一个具体类上。
2. 工厂方法模式之所以有一个别名叫多态性工厂模式是因为具体工厂类都有共同的接口，或者有共同的抽象父类。
3. 当系统扩展需要添加新的产品对象时，仅仅需要添加一个具体对象以及一个具体工厂对象，原有工厂对象不需要进行任何修改，也不需要修改客户端，很好的符合了开放-封闭原则。而简单工厂模式在添加新产品对象后，不得不修改工厂方法，扩展性不好。
4. 工厂方法模式退化后可以演变成简单工厂模式。

**应用场景：**  
工厂方法经常用在以下两种情况中:
1. 对于某个产品，调用者清楚地知道应该使用哪个具体工厂服务，实例化该具体工厂，生产出具体的产品来。Java Collection中的iterator() 方法即属于这种情况。
2. 只是需要一种产品，而不想知道也不需要知道究竟是哪个工厂为生产的，即最终选用哪个具体工厂的决定权在生产者一方，它们根据当前系统的情况来实例化一个具体的工厂返回给使用者，而这个决策过程这对于使用者来说是透明的。