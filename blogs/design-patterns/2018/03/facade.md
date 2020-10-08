---
title: 设计模式-----12、外观模式
date: 2018-03-14 14:11:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./proxy
next: ./composite
---

&emsp;&emsp;Facade模式也叫外观模式，是由GoF提出的23种设计模式中的一种。Facade模式为一组具有类似功能的类群，比如类库，子系统等等，提供一个一致的简单的界面。这个一致的简单的界面被称作facade。
![外观模式](/img/blogs/2018/03/facade-structure.png)

**外观模式的角色和职责**  
1. Facade：为调用方定义简单的调用接口。　　
2. Clients：调用者。通过Facade接口调用提供某功能的内部类群。　　
3. Packages：功能提供者。指提供功能的类群（模块或子系统）。

**使用场景**  
在以下情况下可以考虑使用外观模式：
1. 设计初期阶段，应该有意识的将不同层分离，层与层之间建立外观模式。
2. 开发阶段，子系统越来越复杂，增加外观模式提供一个简单的调用接口。
3. 维护一个大型遗留系统的时候，可能这个系统已经非常难以维护和扩展，但又包含非常重要的功能，为其开发一个外观类，以便新系统与其交互。

简单来说，使用了外观模式，用户就不必直接面对众多功能模块，降低了使用难度，简单举个例子  
电脑开机进入系统，我们把他分为4步，首先打开电源，bois自检，系统引导，进入系统，4个功能是四个功能模块  

打开电源
``` java
public class StartPower {
    /*
     * 打开电源
     */
    public void startPower(){
        System.out.println("电脑通电");
    }
}
```

bois自检
``` java
public class BoisSelfTest {
    /*
     * bios自检
     */
    public void boisSelfTest(){
        System.out.println("bios自检");
    }
}
```

系统引导
``` java
public class SystemGuide {
    /*
     * 系统引导
     */
    public void systemGuide(){
        System.out.println("系统引导");
    } 
}
```

进入系统
``` java
public class EnterSystem {
    /*
     * 进入系统
     */
    public void enterSystem(){
        System.out.println("进入系统");
    }
}
```

如果，我们没有使用外观模式，就需要用户自己挨个使用这些功能
``` java
public class MainClass {
    public static void main(String[] args) {
        StartPower startPower = new StartPower(); 
        startPower.startPower();
        
        BoisSelfTest boisSelfTest = new BoisSelfTest();
        boisSelfTest.boisSelfTest();
        
        SystemGuide systemGuide = new SystemGuide();
        systemGuide.systemGuide();
        
        EnterSystem enterSystem = new EnterSystem();
        enterSystem.enterSystem();
    }
}
```

运行结果为：  
<font color=#0099ff size=3 face="黑体">电脑通电</font>  
<font color=#0099ff size=3 face="黑体">bios自检</font>  
<font color=#0099ff size=3 face="黑体">系统引导</font>  
<font color=#0099ff size=3 face="黑体">进入系统</font>  

这样，电脑顺利启动，可是同样可以看出来，用户使用非常繁琐，不仅需要用户自己挨个使用所有用到的功能，同时还需要用户知道电脑启动的顺序，按顺序使用功能，不然就会导致问题，这样显然是不可取的

所以，用到外观模式，创建一个Facade，专门用于使用功能模块
``` java
public class Facade {
    private StartPower startPower = null; 
    private BoisSelfTest boisSelfTest = null;
    private SystemGuide systemGuide = null;
    private EnterSystem enterSystem = null;
    
    public void startComputer(){
        startPower = new StartPower(); 
        boisSelfTest = new BoisSelfTest();
        systemGuide = new SystemGuide();
        enterSystem = new EnterSystem();
        
        startPower.startPower();
        boisSelfTest.boisSelfTest();
        systemGuide.systemGuide();
        enterSystem.enterSystem();
    }
}
```

这时客户端就是这样
``` java
public class MainClass {
    public static void main(String[] args) {
        Facade computer = new Facade();
        computer.startComputer();
    }
}
```
可以看到，用户这时只需要调用Facade中的方法即可，无需知道电脑有什么具体的功能模块，无需知道功能模块执行的顺序是什么，只是调用一下就好了。

简化了使用，同时也增加了代码的复用与可维护性。

**优点：**  
1. **松散耦合：** 使得客户端和子系统之间解耦，让子系统内部的模块功能更容易扩展和维护；
2. **简单易用：** 客户端根本不需要知道子系统内部的实现，或者根本不需要知道子系统内部的构成，它只需要跟Facade类交互即可。
3. **更好的划分访问层次：** 有些方法是对系统外的，有些方法是系统内部相互交互的使用的。子系统把那些暴露给外部的功能集中到门面中，这样就可以实现客户端的使用，很好的隐藏了子系统内部的细节。