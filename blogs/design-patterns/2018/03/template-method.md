---
title: 设计模式-----20、模板方法模式
date: 2018-03-23 16:03:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./iterator
next: ./memento
---

**概念：**  
&emsp;&emsp;Template Method模式也叫模板方法模式，是行为模式之一，它把具有特定步骤算法中的某些必要的处理委让给抽象方法，通过子类继承对抽象方法的不同实现改变整个算法的行为。  

**模板方法模式的应用场景**  
Template Method模式一般应用在具有以下条件的应用中：  
1. 具有统一的操作步骤或操作过程
2. 具有不同的操作细节
3. 存在多个具有同样操作步骤的应用场景，但某些具体的操作细节却各不相同

**模板方法模式的应用实例**  
1. 在造房子的时候，地基、走线、水管都一样，只有在建筑的后期才有加壁橱加栅栏等差异。
2. 西游记里面菩萨定好的 81 难，这就是一个顶层的逻辑骨架。
3. spring 中对 Hibernate 的支持，将一些已经定好的方法封装起来，比如开启事务、获取 Session、关闭 Session 等，程序员不重复写那些已经规范好的代码，直接丢一个实体就可以保存。  

**模板方法模式的结构**  
![模板方法模式结构图](/img/blogs/2018/03/template-method-structure.png)   

**模板方法模式的角色和职责**  
1. AbstractClass：抽象类的父
2. ConcreteClass：具体的实现子
3. templateMethod()：模板方法，具体步骤方法的执行顺序（步骤
4. method1()与method2()：具体步骤方法（细节）  

下面用代码来实现一下：我们举个例子，加入我们要组装汽车，步骤是，先组装车头，再组装车身，最后组装车尾  
这样，我们先建造AbstractClass（其中包含template模板，执行顺序）

``` java
/*
 * 组装车（AbstractClass）
 */
public abstract class MakeCar {
    //组装车头
    public abstract void makeCarHead();
    
    //组装车身
    public abstract void makeCarBody();
    
    //组装车尾
    public abstract void makeCarTail();
    
    //汽车组装流程（template()）
    public void makeCar(){
        this.makeCarHead();
        this.makeCarBody();
        this.makeCarTail();
    }
}
```

再新建ConcreteClass（具体的实现细节）
``` java
//组装公交车
public class MakeBus extends MakeCar{

    @Override
    public void makeCarHead() {
        System.out.println("组装公交车车头");
    }

    @Override
    public void makeCarBody() {
        System.out.println("组装公交车车身");
    }

    @Override
    public void makeCarTail() {
        System.out.println("组装公交车车尾");
    }

/*
 * 组装SUV
 */
public class MakeSuv extends MakeCar{

    @Override
    public void makeCarHead() {
        System.out.println("组装SUV车头");
    }

    @Override
    public void makeCarBody() {
        System.out.println("组装SUV车身");
    }

    @Override
    public void makeCarTail() {
        System.out.println("组装SUV车尾");
    }
}
```

最后运行一下
``` java
public class MainClass {
    public static void main(String[] args) {
        MakeCar makeBus = new MakeBus();
        makeBus.makeCar();
        
        System.out.println("===========================");
        
        MakeCar makeSuv = new MakeSuv();
        makeSuv.makeCar();
    }
}
```

运行结果：  
<font color=#0099ff size=3 face="黑体">制造公交车车头</font>  
<font color=#0099ff size=3 face="黑体">制造公交车车身</font>  
<font color=#0099ff size=3 face="黑体">制造公交车车尾</font>  
<font color=#0099ff size=3 face="黑体">=====================</font>  
<font color=#0099ff size=3 face="黑体">制造SUV车头</font>  
<font color=#0099ff size=3 face="黑体">制造SUV车身</font>  
<font color=#0099ff size=3 face="黑体">制造SUV车尾</font>  

这样，用户不必关心具体的执行流程（步骤）了。  

**模板方法模式的优缺点：**  
**优点：**  
1. 封装不变部分，扩展可变部分。 
2. 提取公共代码，便于维护。 3、行为由父类控制，子类实现。  

**缺点：**  
每一个不同的实现都需要一个子类来实现，导致类的个数增加，使得系统更加庞大。  

**注意事项：**  
为防止恶意操作，一般模板方法都加上 final 关键词。