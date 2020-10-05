---
title: 面向对象五大原则-----依赖倒转原则
date: 2018-03-29 14:45:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./lsp
next: ./lod
---

**什么是依赖倒转原则**  
&emsp;&emsp;依赖倒转(Dependence Inversion Principle )：是程序要依赖于抽象接口，不要依赖于具体实现。简单的说就是要求对抽象进行编程，不要对实现进行编程，这样就降低了客户与实现模块间的耦合。  
1. 抽象不应该依赖于细节，细节应该依赖于抽象。
2. 高层模块不依赖底层模块，两者都依赖抽象。　 

我们举个例子：电脑有不同的组件，硬盘，内存，主板。  
硬盘抽象类
``` java
//硬盘抽象类
public abstract class HardDisk {
    public abstract void doSomething();
}
```

具体硬盘（希捷硬盘）
``` java
//希捷硬盘
public class XiJieHardDisk extends HardDisk {

    public void doSomething() {
        System.out.println("希捷硬盘");
    }

}
```

具体硬盘（西数硬盘）
``` java
public class XiShuHardDisk extends HardDisk {

    public void doSomething() {
        System.out.println("西数硬盘");
    }

}
```

主板抽象类　
``` java
//主板抽象类
public abstract class MainBoard {
    public abstract void doSomething();
}
```

具体主板（华硕主板）
``` java
public class HuaShuoMainBoard extends MainBoard{

    public void doSomething() {
        System.out.println("华硕主板");
    }

}
```

具体主板（微星主板）
``` java
public class WeiXingMainBoard extends MainBoard {

    public void doSomething() {
        System.out.println("微星主板");
    }

}
```

内存抽象类　　
``` java
//内存抽象类
public abstract class Memory {
    public abstract void doSomething();
}
```

具体内存（金士顿内存）
``` java
public class JinShiDunMemory extends Memory {

    public void doSomething() {
        System.out.println("金士顿内存");
    }

}
```

具体内存（三星内存）
``` java
public class SanxingMemory extends Memory {

    public void doSomething() {
        System.out.println("三星内存");
    }

}
```
现在，电脑的各个零部件都有了，只差电脑了。首先，我们不按照依赖倒转原则，按照传统模式  
**传统的过程式设计倾向于使高层次的模块依赖于低层次的模块，抽象层依赖于具体的层次。**  
![图1](/img/blogs/2018/03/dip1.png)  

这样，电脑应该是这样的
``` java
//电脑
public class Computer{
    private HuaShuoMainBoard huaShuoMainBoard;
    private JinShiDunMemory jinShiDunMemory;
    private XiJieHardDisk xiJieHardDisk;
    
    public HuaShuoMainBoard getHuaShuoMainBoard() {
        return huaShuoMainBoard;
    }
    public void setHuaShuoMainBoard(HuaShuoMainBoard huaShuoMainBoard) {
        this.huaShuoMainBoard = huaShuoMainBoard;
    }
    public JinShiDunMemory getJinShiDunMemory() {
        return jinShiDunMemory;
    }
    public void setJinShiDunMemory(JinShiDunMemory jinShiDunMemory) {
        this.jinShiDunMemory = jinShiDunMemory;
    }
    public XiJieHardDisk getXiJieHardDisk() {
        return xiJieHardDisk;
    }
    public void setXiJieHardDisk(XiJieHardDisk xiJieHardDisk) {
        this.xiJieHardDisk = xiJieHardDisk;
    }
}
```

这时，要组装一台电脑
``` java
public class MainClass {
    public static void main(String[] args) {
        Computer computer = new Computer();
        computer.setHuaShuoMainBoard(new HuaSuoMainBoard());
        computer.setJinShiDunMemory(new JinShiDunMemory());
        computer.setXiJieHardDisk(new XiJieHardDisk());
        
        computer.setHuaShuoMainBoard(new WeiXingMainBoard());//报错，无法安装
    }
}
```
可以看到，这种情况下，这台电脑就只能安装华硕主板，金士顿内存和希捷硬盘了，这对用户肯定是不友好的，用户有了机箱肯定是想按照自己的喜好，选择自己喜欢的配件。  
电脑就是高层业务逻辑，主板，内存，硬盘就是中层模块，还有更低的底层模块我们没有写那么细，但都是一个意思，这样的方式显然是不可取的。  
下面，我们改造一下，让Computer依赖接口或抽象类，下面的模块同样如此  
![图1](/img/blogs/2018/03/dip2.png)  

![图1](/img/blogs/2018/03/dip3.png)  

Computer
``` java
public class Computer {
    private MainBoard mainBoard;
    private Memory memory;
    private HardDisk harddisk;

    public MainBoard getMainBoard() {
        return mainBoard;
    }

    public void setMainBoard(MainBoard mainBoard) {
        this.mainBoard = mainBoard;
    }

    public Memory getMemory() {
        return memory;
    }

    public void setMemory(Memory memory) {
        this.memory = memory;
    }

    public HardDisk getHarddisk() {
        return harddisk;
    }

    public void setHarddisk(HardDisk harddisk) {
        this.harddisk = harddisk;
    }
}
```

这时，再组装
``` java
public class MainClass {
    public static void main(String[] args) {
        Computer computer = new Computer();
        computer.setMainBoard(new HuaSuoMainBoard());
        computer.setMemory(new JinShiDunMemory());
        computer.setHarddisk(new XiJieHardDisk());
        
        computer.setMainBoard(new WeiXingMainBoard());//完全没有问题
    }
}
```
这样，用户就可以根据自己的喜好来选择自己喜欢的品牌，组装电脑了。  

**为什么要采取依赖倒转这种方式**  
&emsp;&emsp;面向过程的开发，上层调用下层，上层依赖于下层，当下层剧烈变动时上层也要跟着变动，这就会导致模块的复用性降低而且大大提高了开发的成本。  
&emsp;&emsp;面向对象的开发很好的解决了这个问题，一般情况下抽象的变化概率很小，让用户程序依赖于抽象，实现的细节也依赖于抽象。即使实现细节不断变动，只要抽象不变，客户程序就不需要变化。这大大降低了客户程序与实现细节的耦合度。  

**依赖倒转模式应用实例**  
1. [工厂方法模式](../02/factory-method.md)
2. [模板方法模式](./template-method.md)
3. [迭代模式](./iterator.md)  

&emsp;&emsp;综上所诉，我们可以看出一个应用中的重要策略决定及业务模型正是在这些高层的模块中。也正是这些模型包含着应用的特性。但是，当这些模块依赖于低层模块时，低层模块的修改将会直接影响到它们，迫使它们也去改变。这种境况是荒谬的。应该是处于高层的模块去迫使那些低层的模块发生改变。应该是处于高层的模块优先于低层的模块。无论如何高层的模块也不应依赖于低层的模块。而且，我们想能够复用的是高层的模块。通过子程序库的形式，我们已经可以很好地复用低层的模块了。当高层的模块依赖于低层的模块时，这些高层模块就很难在不同的环境中复用。但是，当那些高层模块独立于低层模块时，它们就能很简单地被复用了。这正是位于框架设计的最核心之处的原则。