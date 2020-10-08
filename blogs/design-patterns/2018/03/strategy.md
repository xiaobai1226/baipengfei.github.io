---
title: 设计模式-----8、策略模式
date: 2018-03-08 14:05:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./decorator
next: ./observer
---

&emsp;&emsp;Strategy模式也叫策略模式是行为模式之一，它对一系列的算法加以封装，为所有算法定义一个抽象的算法接口，并通过继承该抽象算法接口对所有的算法加以封装和实现，具体的算法选择交由客户端决定（策略）。Strategy模式主要用来平滑地处理算法的切换。  
&emsp;&emsp;举个例子：假如有两个加密算法，我们分别调用他们，之前我们可以这么写

先写一个算法接口
``` java
public interface Strategy {
    //加密
    public void encrypt();
}
```

再写两个对应的实现类
``` java
public class MD5Strategy implements Strategy {
    @Override
    public void encrypt() {
        System.out.println("执行MD5加密");
    }
}
```

``` java
public class RSAStrategy implements Strategy{
    @Override
    public void encrypt() {
        System.out.println("执行RSA加密");
    }
}
```

最后，写一个主函数调用
``` java
public class MainClass {
    public static void main(String[] args) {
        Strategy md5 = new MD5Strategy();
        md5.encrypt();
        
        Strategy rsa = new RSAStrategy();
        rsa.encrypt();
    }
}
```
这样使我们使用传统继承关系方式来实现此功能，接下来使用策略模式  
首先、新建一个Context类，这个类是策略模式的核心类，类似于一个工厂，它包含了所有算法类的所有方法

``` java
public class Context {
    private Strategy strategy;
    
    public Context(Strategy stratrgy){
        this.strategy = stratrgy;
    }
    
    public void encrypt(){
        this.strategy.encrypt();
    }
}
```

两个算法类都不用改变，主函数调用改为
``` java
public class MainClass {
    public static void main(String[] args) {
        Context md5 = new Context(new MD5Strategy());
        md5.encrypt();
        
        Context rsa = new Context(new RSAStrategy());
        rsa.encrypt();
    }
}
```
这样子，用户就只需要关心context即可，也不必关心算法的具体实现，这就是一个简单了策略模式例子

下面看一下，策略模式的结构：
![策略模式结构图](/img/blogs/2018/03/strategy-structure.png)

**策略模式的角色与职责：**
1. Strategy: 策略（算法）抽象。（Strategy接口）
2. ConcreteStrategy：各种策略（算法）的具体实现。（MD5Strategy、RSAStrategy）
3. Context：策略的外部封装类，或者说策略的容器类。根据不同策略执行不同的行为。策略由外部环境决定。（Context）

**策略模式的优缺点：**  
**优点：**
1. 策略模式提供了管理相关的算法族的办法。策略类的等级结构定义了一个算法或行为族。恰当使用继承可以把公共的代码移到父类里面，从而避免重复的代码。
2. 策略模式提供了可以替换继承关系的办法。继承可以处理多种算法或行为。如果不是用策略模式，那么使用算法或行为的环境类就可能会有一些子类，每一个子类提供一个不同的算法或行为。但是，这样一来算法或行为的使用者就和算法或行为本身混在一起。决定使用哪一种算法或采取哪一种行为的逻辑就和算法或行为的逻辑混合在一起，从而不可能再独立演化。继承使得动态改变算法或行为变得不可能。
3. 使用策略模式可以避免使用多重条件转移语句。多重转移语句不易维护，它把采取哪一种算法或采取哪一种行为的逻辑与算法或行为的逻辑混合在一起，统统列在一个多重转移语句里面，比使用继承的办法还要原始和落后。

**缺点：**
1. 客户端必须知道所有的策略类，并自行决定使用哪一个策略类。这就意味着客户端必须理解这些算法的区别，以便适时选择恰当的算法类。换言之，策略模式只适用于客户端知道所有的算法或行为的情况。
2. 策略模式造成很多的策略类。有时候可以通过把依赖于环境的状态保存到客户端里面，而将策略类设计成可共享的，这样策略类实例可以被不同客户端使用。换言之，可以使用享元模式来减少对象的数量。

**应用场景：**　
1. 多个类只区别在表现行为不同，可以使用Strategy模式，在运行时动态选择具体要执行的行为。
2. 需要在不同情况下使用不同的策略(算法)，或者策略还可能在未来用其它方式来实现。
3. 对客户隐藏具体策略(算法)的实现细节，彼此完全独立。