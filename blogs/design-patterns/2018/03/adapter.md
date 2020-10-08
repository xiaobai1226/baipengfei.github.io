---
title: 设计模式-----15、适配器模式
date: 2018-03-19 11:38:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./bridge
next: ./interpreter
---

**概念：**  
&emsp;&emsp;Adapter模式也叫适配器模式，是构造型模式之一，通过Adapter模式可以改变已有类（或外部类）的接口形式。  
&emsp;&emsp;举个例子：我们使用电脑，家里的电源是220V的，而我们的电脑是18V的，这时如果我们直接把电源连接电脑，一定会导致电脑被烧坏，因为电源电压太高了，这时我们就需要一个电源适配器，连接在电源与电脑之间，通过适配器进行一个降压，来保证电脑的正常工作。  

无适配器  
![适配器模式结构图](/img/blogs/2018/03/adapter1.png)  

增加适配器  
![适配器模式结构图](/img/blogs/2018/03/adapter2.png)  

用代码实现：  
首先如果不使用适配器的话  
新建一个220V电源  

``` java
//220V电源
public class PowerSupply {
    public void powerSupply220V(){
        System.out.println("使用220V电源");    
    }
}
```

新建一个笔记本电脑，使用电源
``` java
//笔记本电脑使用220V电源
public class Computer {
    public static void main(String[] args) {
        PowerSupply powerSupply = new PowerSupply();
        powerSupply.powerSupply220V();
    }
}
```

结果如下：  
<font color=#0099ff size=3 face="黑体">使用220V电源</font>  

&emsp;&emsp;这样笔记本电脑就直接使用了220V电压，但是这样的话，笔记本电脑会直接烧毁，无法使用，因为电压太高了，所以我们需要在中间接一个适配器，以达到降压的目的。  

适配器继承220V电压
``` java
//适配器
public class Adapter extends PowerSupply{
    public void powerSupply18V(){
        System.out.println("使用适配器");
        this.powerSupply220V();
        System.out.println("电压降为18V");
    }
}
```

笔记本电脑通过适配器调用电源
``` java
//笔记本电脑通过适配器使用220V电源
public class Computer {
    public static void main(String[] args) {
        Adapter adapter = new Adapter();
        adapter.powerSupply18V();
    }
}
```

结果如下：  
<font color=#0099ff size=3 face="黑体">使用适配器</font>  
<font color=#0099ff size=3 face="黑体">使用220V电源</font>  
<font color=#0099ff size=3 face="黑体">电压降为18V</font>  

可以看到，通过这种形式，我们使用的还是之前的那个电源，但是通过适配器，电压就降到了18V，电脑就可以正常使用了。  

但是这只是适配器模式的其中一种形式。下面更详细的说明一下适配器模式

**适配器模式使用场景**  
在大规模的系统开发过程中，我们常常碰到诸如以下这些情况：  
&emsp;&emsp;我们需要实现某些功能，这些功能已有还不太成熟的一个或多个外部组件，如果我们自己重新开发这些功能会花费大量时间；所以很多情况下会选择先暂时使用外部组件，以后再考虑随时替换。但这样一来，会带来一个问题，随着对外部组件库的替换，可能需要对引用该外部组件的源代码进行大面积的修改，因此也极可能引入新的问题等等。如何最大限度的降低修改面呢？  
&emsp;&emsp;Adapter模式就是针对这种类似需求而提出来的。Adapter模式通过定义一个新的接口（对要实现的功能加以抽象），和一个实现该接口的Adapter（适配器）类来透明地调用外部组件。这样替换外部组件时，最多只要修改几个Adapter类就可以了，其他源代码都不会受到影响。

简单来说：
1. 系统需要使用现有的类，而这些类的接口不符合系统的需要。 
2. 想要建立一个可以重复使用的类，用于与一些彼此之间没有太大关联的一些类，包括一些可能在将来引进的类一起工作。 
3. 需要一个统一的输出接口，而输入端的类型不可预知。

下面说一下适配器模式的结构  
**1. 通过继承实现Adapter**  
![适配器模式结构图](/img/blogs/2018/03/adapter3.png)  

这种形式，就是我们刚才举的例子  
**Client：** 就是笔记本电脑（Computer）  
**Target：** 就是笔记本电脑中调用的方法（adapter.powerSupply18V()）  
**Adaptee：** 就是220V电压（PowerSupply）  
**Adapter：** 就是适配器（Adapter）  

**2. 通过委让实现Adapter**  
![适配器模式结构图](/img/blogs/2018/03/adapter4.png)  

第二种模式，只需修改适配器与电脑即可  
适配器不再继承电源，而是当成一个成员变量
``` java
//适配器
public class Adapter{
    private PowerSupply powerSupply;
    
    public Adapter(PowerSupply powerSupply){
        this.powerSupply = powerSupply;
    }
    
    public void powerSupply18V(){
        System.out.println("使用适配器");
        this.powerSupply.powerSupply220V();
        System.out.println("电压降为18V");
    }
}
```

电脑
``` java
//笔记本电脑通过适配器使用220V电源
public class Computer {
    public static void main(String[] args) {
        Adapter2 adapter = new Adapter2(new PowerSupply());
        adapter.powerSupply18V();
    }
}
```

一般，使用第二种委让形式更多一些，因为这种方式不必继承，使用成员变量更加的灵活