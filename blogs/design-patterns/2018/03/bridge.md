---
title: 设计模式-----14、桥接模式
date: 2018-03-16 10:15:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./composite
next: ./adapter
---

&emsp;&emsp;Bridge 模式又叫做桥接模式，是构造型的设计模式之一。Bridge模式基于类的最小设计原则，通过使用封装，聚合以及继承等行为来让不同的类承担不同的责任。它的主要特点是把抽象（abstraction）与行为实现（implementation）分离开来，从而可以保持各部分的独立性以及应对它们的功能扩展。  
&emsp;&emsp;举个例子，我们都知道，汽车有不同的发动机，有油的，有电的，还有用天然气的。  
&emsp;&emsp;我们先举两个不采用桥接模式的例子，通过对比，来看出桥接模式的优势

**第一个：**  
&emsp;&emsp;先新建一个接口Car，所有车都实现这个接口，这个接口中有一个公共的方法installEngine()安装发动机。
``` java
/*
 * 汽车
 */
public interface Car {
    //安装引擎
    public void installEngine();
}
```

&emsp;&emsp;然后，不同的车，比如公交，suv，轿车，都有不同的发动机，所以先新建不同的车，实现Car接口，因为不同种类的车下面还有不同的发动机，所以将具体的车建为抽象类，将其中实现Car的方法也抽象化。

公交
``` java
/*
 * 公交车
 */
public abstract class Bus implements Car{

    @Override
    public abstract void installEngine();
}
```

SUV
``` java
/*
 * SUV
 */
public abstract class Suv implements Car{

    @Override
    public abstract void installEngine();
}
```

不同的车有不同的发动机，每种车的不同发动机都是一个子类
``` java
public class OilBus extends Bus{
    @Override
    public void installEngine() {
        System.out.println("给公交安装燃油发动机");
    }
}

public class ElectricityBus extends Bus{
    @Override
    public void installEngine() {
        System.out.println("给公交安装电动发动机");
    }
}

public class OilSuv extends Suv{
    @Override
    public void installEngine() {
        System.out.println("给SUV安装燃油发动机");
    }
}

public class ElectricitySuv extends Suv{
    @Override
    public void installEngine() {
        System.out.println("给SUV安装电动发动机");
    }
}
```
 
 运行客户端
``` java
public class MainClass {
    public static void main(String[] args) {
        Car car = new OilBus();
        car.installEngine();
    }
}
```

可以看到这样的结果：  
<font color=#0099ff size=3 face="黑体">给公交安装燃油发动机</font>  

但是这样有个很大的弊端
![桥接模式结构图](/img/blogs/2018/03/bridge1.png)

可以看到，一种车每增加一种发动机就要增加一个子类，到了后期，子类会越来越多，越来越庞大。这种方法不推荐使用。

**第二个例子：**  
把所有的发动机都定义到Car接口中，每种车实现一次就好了

Car
``` java
/*
 * 汽车
 */
public interface Car {
    //安装燃油引擎
    public void installOilEngine();
    //安装电动引擎
    public void installElectricityEngine();
}
```

Bus
``` java
/*
 * 公交车
 */
public class Bus implements Car{
    @Override
    public void installOilEngine() {
        System.out.println("给公交安装燃油发动机");
    }

    @Override
    public void installElectricityEngine() {
        System.out.println("给公交安装电动发动机");
    }
}
```

Suv
``` java
/*
 * SUV
 */
public class Suv implements Car{
    @Override
    public void installOilEngine() {
        System.out.println("给SUV安装燃油发动机");
    }

    @Override
    public void installElectricityEngine() {
        System.out.println("给SUV安装电动发动机");
    }
}
```

客户端
``` java
public class MainClass {
    public static void main(String[] args) {
        Car bus = new Bus();
        Car suv = new Suv();
        
        bus.installOilEngine();
        bus.installElectricityEngine();
        
        suv.installOilEngine();
        suv.installElectricityEngine();
    }
}
```

运行结果  
<font color=#0099ff size=3 face="黑体">给公交安装燃油发动机</font>  
<font color=#0099ff size=3 face="黑体">给公交安装电动发动机</font>  
<font color=#0099ff size=3 face="黑体">给SUV安装燃油发动机</font>  
<font color=#0099ff size=3 face="黑体">给SUV安装电动发动机</font>  

&emsp;&emsp;这种方式就没有那么多子类了，每种车只有一个实现类，但是这种方法不符合我们的开放封闭原则，每增加一种发动机，就要修改Car接口，并修改所有实现类。这种方法肯定也是不推荐的。  
&emsp;&emsp;接下来，就要说到桥接模式了。  
&emsp;&emsp; **桥接模式的概念：** Bridge模式基于类的最小设计原则，通过使用封装，聚合以及继承等行为来让不同的类承担不同的责任。它的主要特点是把抽象（abstraction）与行为实现（implementation）分离开来，从而可以保持各部分的独立性以及应对它们的功能扩展。

&emsp;&emsp;把抽象与行为实现分开，保证各部分的独立性，所以我们可以把车和发动机分离开来，保证他们各自的独立性。
![桥接模式结构图](/img/blogs/2018/03/bridge2.png)

&emsp;&emsp;增加一种车，对发动机没有影响，增加发动机吧对车也没有影响，Car接口中有对Engine的引用，也就是Car体系与Engine体系之间的桥梁。
![桥接模式结构图](/img/blogs/2018/03/bridge3.png)
　　
**桥接模式的角色和职责**  
1. **Client：** Bridge模式的使用者
2. **Abstraction（Car）**  
2.1. 抽象类接口（接口或抽象类）  
2.2. 维护对行为实现（Implementor）的引用
3. **Refined Abstraction（Bus、Suv）：** Abstraction子类
4. **Implementor（Engine）：** 行为实现类接口 (Abstraction接口定义了基于Implementor接口的更高层次的操作)
5. **ConcreteImplementor（OilEngine、ElectricityEngine）：** Implementor子类

接下来，用代码实现：  
首先，新建发动机体系
``` java
/*
 * 发动机
 */
public interface Engine {
    public void installEngine();
}

/*
 * 燃油发动机
 */
public class OilEngine implements Engine{
    @Override
    public void installEngine() {
        System.out.println("安装燃油发动机");
    }
}

/*
 * 电动发动机
 */
public class ElectricityEngine implements Engine{
    @Override
    public void installEngine() {
        System.out.println("安装电动发动机");
    }
}
```
 
新建Car体系
``` java
/*
 * 汽车
 */
public abstract class Car {
    private Engine engine;
    
    public Car(Engine engine){
        this.engine = engine;
    }
    
    //安装发动机
    public abstract void installEngine();

    public Engine getEngine() {
        return engine;
    }
 
    public void setEngine(Engine engine) {
        this.engine = engine;
    }
}

/*
 * 公交车
 */
public class Bus extends Car{

    public Bus(Engine engine) {
        super(engine);
    }

    @Override
    public void installEngine() {
        System.out.print("公交：");
        this.getEngine().installEngine();
    }
}

/*
 * SUV
 */
public class Suv extends Car{
    public Suv(Engine engine) {
        super(engine);
    }

    @Override
    public void installEngine() {
        System.out.print("SUV：");
        this.getEngine().installEngine();
    }
}
```
 
最后，新建客户端调用
``` java
public class MainClass {
    public static void main(String[] args) {
        Engine oilEngine = new OilEngine();
        Engine electricityEngine = new ElectricityEngine();
        
        Car oilBus = new Bus(oilEngine);
        Car electricityBus = new Bus(electricityEngine);
        
        Car oilSuv = new Suv(oilEngine);
        Car electricitySuv = new Suv(electricityEngine);
        
        oilBus.installEngine();
        electricityBus.installEngine();
        
        oilSuv.installEngine();
        electricitySuv.installEngine();
    }
}
```

结果如下：  
<font color=#0099ff size=3 face="黑体">公交：安装燃油发动机</font>  
<font color=#0099ff size=3 face="黑体">公交：安装电动发动机</font>  
<font color=#0099ff size=3 face="黑体">SUV：安装燃油发动机</font>  
<font color=#0099ff size=3 face="黑体">SUV：安装电动发动机</font>  

可以看到，这样子的话，新建这的种类，丝毫不影响发动机，新建一种发动机，也不影响车，这就是一个简单的桥接模式的例子

**总结：**  
**桥接模式的优点**  
1. 实现了抽象和实现部分的分离
&emsp;&emsp;桥接模式分离了抽象部分和实现部分，从而极大的提供了系统的灵活性，让抽象部分和实现部分独立开来，分别定义接口，这有助于系统进行分层设计，从而产生更好的结构化系统。对于系统的高层部分，只需要知道抽象部分和实现部分的接口就可以了。
2. 更好的可扩展性
&emsp;&emsp;由于桥接模式把抽象部分和实现部分分离了，从而分别定义接口，这就使得抽象部分和实现部分可以分别独立扩展，而不会相互影响，大大的提供了系统的可扩展性。
3. 可动态的切换实现
&emsp;&emsp;由于桥接模式实现了抽象和实现的分离，所以在实现桥接模式时，就可以实现动态的选择和使用具体的实现。
4. 实现细节对客户端透明，可以对用户隐藏实现细节。

**桥接模式的缺点**
1. 桥接模式的引入增加了系统的理解和设计难度，由于聚合关联关系建立在抽象层，要求开发者针对抽象进行设计和编程。
2. 桥接模式要求正确识别出系统中两个独立变化的维度，因此其使用范围有一定的局限性。

**桥接模式的使用场景**
1. 如果一个系统需要在构件的抽象化角色和具体化角色之间增加更多的灵活性，避免在两个层次之间建立静态的继承联系，通过桥接模式可以使它们在抽象层建立一个关联关系。
2. 抽象化角色和实现化角色可以以继承的方式独立扩展而互不影响，在程序运行时可以动态将一个抽象化子类的对象和一个实现化子类的对象进行组合，即系统需要对抽象化角色和实现化角色进行动态耦合。
3. 一个类存在两个独立变化的维度，且这两个维度都需要进行扩展。
4. 虽然在系统中使用继承是没有问题的，但是由于抽象化角色和具体化角色需要独立变化，设计要求需要独立管理这两者。
5. 对于那些不希望使用继承或因为多层次继承导致系统类的个数急剧增加的系统，桥接模式尤为适用