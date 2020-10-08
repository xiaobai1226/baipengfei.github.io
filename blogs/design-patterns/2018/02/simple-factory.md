---
title: 设计模式-----1、简单工厂模式
date: 2018-02-27 11:36:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: false
next: ./factory-method
---

&emsp;&emsp;简单工厂模式是属于创建型模式，又叫做静态工厂方法（Static Factory Method）模式，但不属于23种GOF设计模式之一。简单工厂模式是由一个工厂对象决定创建出哪一种产品类的实例，简单来说就是，
<font color=#0099ff>通过专门定义一个类来负责创建其他类的实例，被创建的实例通常都具有共同的父类。</font>
简单工厂模式是工厂模式家族中最简单实用的模式，可以理解为是不同工厂模式的一个特殊实现。  
首先举个例子：创建两个类，一个Apple，一个Banana，都有一个方法
``` java
public class Apple{
    public void get(){
        System.out.println("采集苹果");
    }
}
```
``` java
public class Banana{
    public void get(){
        System.out.println("采集香蕉");
    }
}
```
在创建一个主方法来调用这两个类中的方法
``` java
public class MainClass {
     public static void main(String[] args) {
         //实例化Apple
         Apple apple = new Apple();
         //实例化Banana
         Banana banana = new Banana();
         
         apple.get();
         banana.get();
    }
}
```
执行后，输出结果为：  
<font color=#0099ff size=4 face="黑体">采集苹果</font>  
<font color=#0099ff size=4 face="黑体">采集香蕉</font>  
但是代码还可以改进，可以看出Apple与Banana的功能类似，所以可以抽取出一个接口，并让Apple与Banana实现此接口
``` java
public interface Fruit {
    public void get();
}
```
``` java
public class Apple implements Fruit{
    public void get(){
        System.out.println("采集苹果");
    }
}
```
``` java
public class Banana implements Fruit{
    public void get(){
        System.out.println("采集香蕉");
    }
}
```
这时，主方法调用形式就变成了这样
``` java
public class MainClass {
    public static void main(String[] args) {
        //实例化一个Apple，用到了多态
        Fruit apple = new Apple();
        //实例化一个Banana，用到了多态
        Fruit banana= new Banana();
        
        apple.get();
        banana.get();    
    }
}
```
这样还是刚才的结果，不同的代码达到了相同的目的。
而简单工厂模式则是通过专门定义一个类来负责创建其他类的实例，被创建的实例通常都具有共同的父类，上面的代码可以看出Apple与Banana实现了同一个接口，所以我们还需要创建一个工厂类来专门创建Apple与Banana的实例，继续改进
创建一个工具类
``` java
public class FruitFactory {
    //获取Apple的实例，用static修饰，方便使用
    public static Fruit getApple(){
        return new Apple();
    }
    
    //获取Banana的实例，用static修饰，方便使用
    public static Fruit getBanana(){
        return new Banana();
    }
}
```
Apple类，Banana类与Fruit接口没有变化
主方法修改为
``` java
public class MainClass {
    public static void main(String[] args) {
        //实例化一个Apple，用到了工厂类
        Fruit apple = FruitFactory.getApple();
        //实例化一个Banana，用到了工厂类
        Fruit banana= FruitFactory.getBanana();
         
        apple.get();
        banana.get();
    }
}
```
同样和之前是一样的结果
这就是一个简单工厂模式的基本使用了，但这样的工厂类还不够好，例子中只有两个实例对象，但如果例子多了以后，工厂类就会产生很多很多的get方法。所以进行如下优化
``` java
public class FruitFactory {
    public static Fruit getFruit(String type) throws InstantiationException, IllegalAccessException{
        //不区分大小写
        if(type.equalsIgnoreCase("Apple")){
            return Apple.class.newInstance();
        }else if(type.equalsIgnoreCase("Banana")){
            return Banana.class.newInstance();
        }else{
            System.out.println("找不到相应的实体类");
            return null;
        }
    }
}
```
这时主方法修改为：
``` java
public class MainClass {
    public static void main(String[] args) throws InstantiationException, IllegalAccessException {
        //实例化一个Apple，用到了工厂类
        Fruit apple = FruitFactory.getFruit("apple");
        //实例化一个Banana，用到了工厂类
        Fruit banana= FruitFactory.getFruit("banana");
        apple.get();
        banana.get();
    }
}
```
这样就可以根据传入的参数动态的创建实例对象，而且传入的参数还可以自定义，非常的灵活，但缺点也很明显，工厂类中有大量的判断
还有另外一种方式
``` java
public class FruitFactory {
    public static Fruit getFruit(String type) throws ClassNotFoundException, InstantiationException, IllegalAccessException{
        Class fruit = Class.forName(type);
        return (Fruit) fruit.newInstance();
    }
}
```
主方法修改为
``` java
public class MainClass {
    public static void main(String[] args) throws InstantiationException, IllegalAccessException, ClassNotFoundException {
        //实例化一个Apple，用到了工厂类
        Fruit apple = FruitFactory.getFruit("Apple");
        //实例化一个Banana，用到了工厂类
        Fruit banana= FruitFactory.getFruit("Banana");
        apple.get();
        banana.get();
    }
}
```
这种方法可以看到，工厂类非常的简洁，但主方法在调用时，输入的参数就固定了，必须为实例类名，不像上一种方法那么灵活。  
这两种方法各有各的优点，可根据实际情况自己选择。  
 
**简单工厂模式中包含的角色及其职责：** 
1. 工厂（Creater）角色  
简单工厂模式的核心，它负责实现创建所有实例的内部逻辑。工厂类可以被外界直接调用，创建所需的产品对象。（FruitFactory类）  
2. 抽象（Product）角色  
简单工厂模式所创建的所有对象的父类，它负责描述所有实例所共有的公共接口。（Fruit接口）  
3. 具体产品（Concrete Product）角色  
简单工厂模式所创建的具体实例对象。（Apple类与Banana类）
  
**简单设计模式的优缺点：**
* **优点：** 简单工厂模式中，工厂类是整个模式的关键所在。它包含必要的判断逻辑，能够根据外界给定的信息，决定究竟应该创建哪个具体类的对象。用户在创建时可以直接使用工厂类去创建所需的实例，而无需去了解这些对象是如何创建以及如何组织的，明确区分了各自的职责和权力，有利于整个软件体系结构的优化。
* **缺点：** 很明显简单工厂模式的缺点也体现在其工厂类上，由于工厂类集中了所有实例的创建逻辑，容易违反GRASPR的高内聚的责任分配原则，另外，当系统中的具体产品类不断增多时，可能会出现要求更改相应工厂类的情况，拓展性并不是很好。  

**使用场景：**
1. 工厂类负责创建的对象比较少；
2. 客户只知道传入工厂类的参数，对于如何创建对象（逻辑）不关心；
3. 由于简单工厂很容易违反高内聚责任分配原则，因此一般只在很简单的情况下应用。