---
title: Java设计模式-----7、装饰模式
date: 2018-03-08 11:16:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./builder
next: ./strategy
---

**首先，什么是装饰者模式呢？？？**  
&emsp;&emsp;装饰（ Decorator ）模式又叫做包装模式。通过一种对客户端透明的方式来扩展对象的功能，是继承关系的一个替换方案。他是23种设计模式之一，英文叫Decorator Pattern，又叫装饰者模式。装饰模式是在不必改变原类文件和使用继承的情况下，动态地扩展一个对象的功能。它是通过创建一个包装对象，也就是装饰来包裹真实的对象。  

**为什么要使用装饰模式**
1. 多用组合，少用继承。
利用继承设计子类的行为，是在编译时静态决定的，而且所有的子类都会继承到相同的行为。然而，如果能够利用组合的做法扩展对象的行为，就可以在运行时动态地进行扩展。
2. 类应设计的对扩展开放，对修改关闭。
             
之前我们假如实现这样一个功能，建造出各种各样不同功能的车，咱们是这样实现的：  
首先，新建一个Car接口，定义了所有车的基本功能，就是跑run()，和展示自己功能的方法show()
``` java
public interface Car {
    public void show();
    public void run();
}
```
然后，在创建各个具体的车实现Car接口
            
会跑的车      
``` java
public class RunCar  implements Car{
    @Override
    public void show() {
        this.run();
        
    }

    @Override
    public void run() {
        System.out.println("可以跑");
        
    }
}
```

会游泳的车            
``` java
public class SwimCar implements Car {
    @Override
    public void show() {
        this.run();
        this.swim();
    }

    @Override
    public void run() {
        System.out.println("可以跑");

    }

    public void swim(){
        System.out.println("可以游泳");
    }
}
```

会飞的车            
``` java
public class FlyCar implements Car {
    @Override
    public void show() {
        this.run();
        this.fly();
    }

    @Override
    public void run() {
        System.out.println("可以跑");

    }

    public void fly(){
        System.out.println("可以飞");
    }
}
```

这时，写一个客户端展示每个车的功能            
``` java
public class MainClass {
    public static void main(String[] args) {
//        Car car = new RunCar();
//        Car car = new FlyCar();
        Car car = new SwimCar();
        car.show();
    }
}
```       
            
这样，每新增一种车，就要新写一个子类实现或继承其他类或接口，就相当于，每新增一种功能，就要新建一辆车。

这时，我们还有一种替代方案，就是使用装饰模式  
* 首先，新建一个Car接口，和一个基础的Car的实现类RunCar，因为只要是车一定有跑的功能，这两个和上面一样，不在重复写了。  
* 然后在新建装饰类，不同的功能建不同的装饰类

1、新建一个装饰类父类，实现Car接口，提供一个有参的构造方法，共有的方法show()，私有的Car成员变量，并为之提供get()，set()方法。  
一定要继承Car，因为装饰过后，还是一辆车
``` java
public abstract class CarDecorator implements Car{
    private Car car;
    
    public CarDecorator(Car car){
        this.car = car;
    }
    
    public Car getCar() {
        return car;
    }

    public void setCar(Car car) {
        this.car = car;
    }

    public abstract void show();
}
```

2、为不同的装饰新建装饰类，并继承CarDecorator抽象类
（1）游泳装饰类，覆盖抽象方法，在新增特有的方法            
``` java
public class SwimCarDecorator extends CarDecorator {
    public SwimCarDecorator(Car car){
        super(car);
    }
    
    @Override
    public void show() {
        this.getCar().show();
        this.swim();
    }
    
    public void swim(){
        System.out.println("可以游泳");
    }

    @Override
    public void run() {
    }
}
```

（2）飞行装饰类          
``` java
public class FlyCarDecorator extends CarDecorator {
    public FlyCarDecorator(Car car){
        super(car);
    }
    @Override
    public void show() {
        this.getCar().show();
        this.fly();
    }
    
    public void fly(){
        System.out.println("可以飞");
    }
    
    @Override
    public void run() {
    }
}
```

添加客户端，执行            
``` java
public class MainClass {
    public static void main(String[] args) {
        Car car = new RunCar();
        Car swimCar = new SwimCarDecorator(car);
        swimCar.show();
    }

}
```
&emsp;&emsp;这样，就不等于是，每新增一个功能就新建一辆车了，而是基础有一个RunCar，这是最基本的车，装饰类就相当于在基本的车的基础上，添加功能，装饰这台最基本的车。  
&emsp;&emsp;所以一定要继承Car，因为装饰过后，还是一辆车，我们可以直接Car swimCar = new SwimCarDecorator(car);用Car来创建变量。  
&emsp;&emsp;同样，继承关系如果每一个功能都要添加一个新的子类，如果，一辆车已经拥有了游泳和飞行的功能，这时有新增同时拥有游泳和飞行的Car，继承关系就需要在新建一个子类同时拥有这两个功能，而装饰模式什么都不需要新增，对基础的RunCar修饰两遍即可。像这样：       
``` java
public class MainClass {
    public static void main(String[] args) {
        Car car = new RunCar();
        Car swimCar = new SwimCarDecorator(car);
        Car flySwimCar = new FlyCarDecorator(swimCar);
        flySwimCar.show();
    }
}
```
这样子，最后的flySwimCar就同时拥有了飞行和游泳的功能，这也是装饰类继承Car的原因，这样子装饰类才能当做参数放进构造方法中。
           
装饰模式的结构图：
![装饰模式的结构图](/img/blogs/2018/03/decorator-structure.png "装饰模式的结构图")

**装饰模式的角色与职责：**
1. 抽象组件角色（Component）： 一个抽象接口，是被装饰类和装饰类的父接口。（Car）
2. 具体组件角色（ConcreteComponent）：为抽象组件的实现类。（RunCar）
3. 抽象装饰角色（Decorator）：包含一个组件的引用，并定义了与抽象组件一致的接口。（CarDecorator）
4. 具体装饰角色（ConcreteDecorator）：为抽象装饰角色的实现类。负责具体的装饰。（FlyCarDecorator、SwimCarDecorator）

**使用范围**
以下情况使用Decorator模式
1. 需要扩展一个类的功能，或给一个类添加附加职责。
2. 需要动态的给一个对象添加功能，这些功能可以再动态的撤销。
3. 需要增加由一些基本功能的排列组合而产生的非常大量的功能，从而使继承关系变的不现实。
4. 当不能采用生成子类的方法进行扩充时。一种情况是，可能有大量独立的扩展，为支持每一种组合将产生大量的子类，使得子类数目呈爆炸性增长。另一种情况可能是因为类定义被隐藏，或类定义不能用于生成子类。

**装饰模式的优缺点**  
**优点**
1. Decorator模式与继承关系的目的都是要扩展对象的功能，但是Decorator可以提供比继承更多的灵活性。
2. 通过使用不同的具体装饰类以及这些装饰类的排列组合，设计师可以创造出很多不同行为的组合。

**缺点**
1. 这种比继承更加灵活机动的特性，也同时意味着更加多的复杂性。
2. 装饰模式会导致设计中出现许多小类，如果过度使用，会使程序变得很复杂。
3. 装饰模式是针对抽象组件（Component）类型编程。但是，如果你要针对具体组件编程时，就应该重新思考你的应用架构，以及装饰者是否合适。当然也可以改变Component接口，增加新的公开的行为，实现“半透明”的装饰者模式。在实际项目中要做出最佳选择。