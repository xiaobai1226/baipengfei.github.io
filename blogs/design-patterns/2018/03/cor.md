---
title: 设计模式-----18、职责链模式
date: 2018-03-21 13:59:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./mediator
next: ./iterator
---

**概念：**  
&emsp;&emsp;Chain of Responsibility（CoR）模式也叫职责链模式、责任链模式或者职责连锁模式，是行为模式之一，该模式构造一系列分别担当不同的职责的类的对象来共同完成一个任务，这些类的对象之间像链条一样紧密相连，所以被称作职责链模式。  

**职责链模式的应用场景**  
1. 比如客户Client要完成一个任务，这个任务包括a,b,c,d四个部分。首先客户Client把任务交给A，A完成a部分之后，把任务交给B，B完成b部分之后，把任务交给C，C完成c部分之后，把任务交给D，直到D完成d部分。  
2. 比如政府部分的某项工作，县政府先完成自己能处理的部分，不能处理的部分交给省政府，省政府再完成自己职责范围内的部分，不能处理的部分交给中央政府，中央政府最后完成该项工作。  
3. SERVLET容器的过滤器（Filter）框架实现。  

下面，举一个例子，假如我们要造汽车，制造汽车的流程是先制造车头，再制造车身，最后制造车尾  
我们先不用职责链模式  
首先，新建一个制造汽车流程的抽象类  
``` java
/*
 * 制造汽车流程抽象类
 */
public abstract class CarHandler {
    public abstract void HandlerCar();
}
```

制造车头
``` java
/*
 * 制造车头
 */
public class CarHeadHandler extends CarHandler {

    @Override
    public void HandlerCar() {
        System.out.println("制造车头");
    }
}
```

制造车身
``` java
/*
 * 制造车身
 */
public class CarBodyHandler extends CarHandler {

    @Override
    public void HandlerCar() {
        System.out.println("制造车身");
    }
}
```
 
制造车尾
``` java
/*
 * 制造车尾
 */
public class CarTailHandler extends CarHandler {

    @Override
    public void HandlerCar() {
        System.out.println("制造车尾");
    }
}
```

客户端
``` java
public class MainClass {
    public static void main(String[] args) {
        CarHandler carHead = new CarHeadHandler();
        CarHandler carBody = new CarBodyHandler();
        CarHandler carTail = new CarTailHandler();
        
        carHead.HandlerCar();
        carBody.HandlerCar();
        carTail.HandlerCar();
    }
}
```

运行结果：  
<font color=#0099ff size=3 face="黑体">制造车头</font>  
<font color=#0099ff size=3 face="黑体">制造车身</font>  
<font color=#0099ff size=3 face="黑体">制造车尾</font>  

可以看到这种形式，制造汽车的每一步都需要用户来完成，用户制造完车头了，再由用户去制造车身，非常麻烦。  
我们想要的是什么，用户制造汽车，制造完车头了，自动的去制造车身，然后再自动的去制造车尾。这就需要用到职责链模式了。  

**职责链模式的基本条件**  
要实现Chain of Responsibility模式，需要满足该模式的基本条件：  
1. 对象链的组织。需要将某任务的所有职责执行对象以链的形式加以组织。
2. 消息或请求的传递。将消息或请求沿着对象链传递，以让处于对象链中的对象得到处理机会。
3. 处于对象链中的对象的职责分配。不同的对象完成不同的职责。
4. 任务的完成。处于对象链的末尾的对象结束任务并停止消息或请求的继续传递。  

**职责链模式的结构**  
![职责链模式结构图](/img/blogs/2018/03/cor-structure.png)  

**职责链模式的角色和职责**  
1. **抽象处理者(Handler)角色**：定义出一个处理请求的接口。如果需要，接口可以定义 出一个方法以设定和返回对下家的引用。这个角色通常由一个Java抽象类或者Java接口实现。上图中Handler类的聚合关系给出了具体子类对下家的引用，抽象方法handleRequest()规范了子类处理请求的操作。
2. **具体处理者(ConcreteHandler)角色**：具体处理者接到请求后，可以选择将请求处理掉，或者将请求传给下家。由于具体处理者持有对下家的引用，因此，如果需要，具体处理者可以访问下家。  

下面，用职责链模式实现一下刚才的功能  
首先，新建抽象处理者(Handler)角色也就是制造汽车流程的抽象类，在刚才的基础基础上增加一个成员属性，并提供一个set方法、
``` java
/*
 * 制造汽车流程抽象类
 */
public abstract class CarHandler {
    //提供一个CarHandler类型属性，记录下一个要执行的流程
    private CarHandler carHandler;
    //提供一个getNext方法，用来得到下一个要执行的流程
    public CarHandler getNextCarHandler() {
        return carHandler;
    }
    //提供一个setNext方法，用来给属性赋值
    public void setNextCarHandler(CarHandler carHandler) {
        this.carHandler = carHandler;
    }
    
    public abstract void HandlerCar();
}
```

接着新建三个流程
``` java
/*
 * 制造车头
 */
public class CarHeadHandler extends CarHandler {

    @Override
    public void HandlerCar() {
        System.out.println("制造车头");
        //如果当前流程不是最后一个流程，继续执行下一个流程
        if(this.getNextCarHandler() != null){
            this.getNextCarHandler().HandlerCar();
        }
    }
}

/*
 * 制造车身
 */
public class CarBodyHandler extends CarHandler {

    @Override
    public void HandlerCar() {
        System.out.println("制造车身");
        //如果当前流程不是最后一个流程，继续执行下一个流程
        if(this.getNextCarHandler() != null){
            this.getNextCarHandler().HandlerCar();
        }
    }
}

/*
 * 制造车尾
 */
public class CarTailHandler extends CarHandler {

    @Override
    public void HandlerCar() {
        System.out.println("制造车尾");
        //如果当前流程不是最后一个流程，继续执行下一个流程
        if(this.getNextCarHandler() != null){
            this.getNextCarHandler().HandlerCar();
        }
    }
}
```

最后是客户端
``` java
public class MainClass {
    public static void main(String[] args) {
        CarHandler carHead = new CarHeadHandler();
        CarHandler carBody = new CarBodyHandler();
        CarHandler carTail = new CarTailHandler();
        
        //组装顺序预先设定好，顺序是车头，车身，车尾（真正开发也可以封装成一个单独的功能模块）
        carHead.setNextCarHandler(carBody);
        carBody.setNextCarHandler(carTail);
        //调用职责链模式的链头来完成操作
        carHead.HandlerCar();
    }
}
```
 
**职责链模式的优缺点**  
**优点：**  
1. 责任的分担。每个类只需要处理自己该处理的工作（不该处理的传递给下一个对象完成），明确各类的责任范围，符合类的最小封装原则。
2. 可以根据需要自由组合工作流程。如工作流程发生变化，可以通过重新分配对象链便可适应新的工作流程。
3. 类与类之间可以以松耦合的形式加以组织。  

**缺点：**  
因为处理时以链的形式在对象间传递消息，根据实现方式不同，有可能会影响处理的速度。