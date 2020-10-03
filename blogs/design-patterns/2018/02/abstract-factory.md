---
title: Java设计模式-----3、抽象工厂模式
date: 2018-02-28
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./factory-method
next: ../03/singleton
---

&emsp;&emsp;抽象工厂模式是所有形态的工厂模式中最为抽象和最具一般性的一种形态。抽象工厂模式是指当有多个抽象角色时，使用的一种工厂模式。抽象工厂模式可以向客户端提供一个接口，使客户端在不必指定产品的具体的情况下，创建多个产品族中的产品对象。

**<font size=4>产品族</font>**  
&emsp;&emsp;是指位于不同产品等级结构中，功能相关联的产品组成的家族。一般是位于不同的等级结构中的相同位置上。显然，每一个产品族中含有产品的数目，与产品等级结构的数目是相等的，形成一个二维的坐标系，水平坐标是产品等级结构，纵坐标是产品族。叫做相图。  
&emsp;&emsp;当有多个不同的等级结构的产品时，如果使用工厂方法模式就势必要使用多个独立的工厂等级结构来对付这些产品的等级结构。如果这些产品等级结构是平行的，会导致多个平行的工厂等级结构。  
&emsp;&emsp;抽象工厂模式使用同一个 工厂等级结构负责这些不同产品等级结构产品对象的创建。  
&emsp;&emsp;对于每一个产品族，都有一个具体工厂。而每一个具体工厂创建属于同一个产品族，但是分属于不同等级结构的产品。  
&emsp;&emsp;通过引进抽象工厂模式，可以处理具有相同（或者相似）等级结构的多个产品族中的产品对象的创建问题。  
&emsp;&emsp;由于每个具体工厂角色都需要负责两个不同等级结构的产品对象的创建，因此每个工厂角色都需要提供两个工厂方法，分别用于创建两个等级结构的产品。既然每个具体工厂角色都需要实现这两个工厂方法，所以具有一般性，不妨抽象出来，移动到抽象工厂角色中加以声明。  

就好比，水果分为：  
**北方水果：** 北方苹果，北方香蕉；  
**南方水果：** 南方苹果，南方香蕉；  
**热带水果：** 热带苹果，热带香蕉；  
这样看，北方水果，南方水果，热带水果这就是三个不同的产品族。
 
下面写一个简单的抽象工厂模式的小例子：  
&emsp;&emsp;首先确定我们的产品族，产品族为南方水果与北方水果，而水果（产品等级）有苹果和香蕉产品等级，所以具体产品为南方苹果，北方苹果，南方香蕉，北方香蕉。  
具体代码如下：首先每一个族中都有苹果和香蕉，所以定义两个抽象类，其中包含一个抽象方法  
苹果
``` java
public abstract class Apple implements Fruit{
    public abstract void get();
}
```
香蕉
``` java
public abstract class Banana implements Fruit{
    public abstract void get();
}
```
在写苹果香蕉的具体产品，并各自继承对应的抽象类

北方苹果
``` java
public class NorthApple extends Apple {
    @Override
    public void get() {
        System.out.println("采集北方苹果");
    }

}
```

南方苹果
``` java
public class SouthApple extends Apple{
    @Override
    public void get() {
        System.out.println("采集南方苹果");
    }
}
```

北方香蕉
``` java
public class NorthBanana extends Banana {
    @Override
    public void get() {
        System.out.println("采集北方香蕉");
    }
}
```

南方香蕉
``` java
public class SouthBanana extends Banana {
    @Override
    public void get() {
        System.out.println("采集南方香蕉");
    }
}
```
接下来创建工厂，而每一个产品族都对应一个具体的工厂，每个产品族都包含苹果和香蕉，所以每个工厂中都包含苹果和香蕉

抽象工厂
``` java
public interface FruitFactory {
    //实例化一个苹果
    public Fruit getApple();
    //实例化一个香蕉
    public Fruit getBanana();
}
```
 
北方工厂
``` java
public class NorthFactory implements FruitFactory{
    @Override
    public Fruit getApple() {
        return new NorthApple();
    }

    @Override
    public Fruit getBanana() {
        return new NorthBanana();
    }
}
```

南方工厂 
``` java
public class SouthFactory implements FruitFactory{
    @Override
    public Fruit getApple() {
        return new SouthApple();
    }

    @Override
    public Fruit getBanana() {
        return new SouthBanana();
    }
}
```

最后，写一个运行的主方法
``` java
public class MainClass {
    public static void main(String[] args) {
        FruitFactory nf = new NorthFactory();
        
        Fruit nApple = nf.getApple();
        nApple.get();
        
        Fruit nBanana = nf.getBanana();
        nBanana.get();
        
        FruitFactory sf = new SouthFactory();
        
        Fruit sApple = sf.getApple();
        sApple.get();
        
        Fruit sBanana = sf.getBanana();
        sBanana.get();
    }
}
```

最终运行结果：  
<font color=#0099ff size=4 face="黑体">采集北方苹果</font>  
<font color=#0099ff size=4 face="黑体">采集北方香蕉</font>  
<font color=#0099ff size=4 face="黑体">采集南方苹果</font>  
<font color=#0099ff size=4 face="黑体">采集南方香蕉</font>  

&emsp;&emsp;这时如果想新增一个产品族热带水果，只需新建一个热带产品族的工厂即可，已经建好的南方与北方工厂无需改动，也符合开放-封闭原则。  
&emsp;&emsp;但缺点也很明显，从产品等级来看，如果想新增一个产品等级，例如上面的例子只有苹果与香蕉，如果现在新增一个葡萄，就需要在抽象工厂中添加一个葡萄抽象方法，再在每一个具体工厂中实现此方法。这样就完全不符合开放-封闭原则了。  

**优点：**  
1. 它分离了具体的类
2. 它使得易于交换产品系列
3. 它有利于产品的一致性  

**缺点：**  
难以支持新种类的产品
 
**抽象工厂模式中包含的角色及其职责：**  
1. 抽象工厂(Creator)角色：（FruitFactory）  
是抽象工厂模式的核心，包含对多个产品结构的声明，任何工厂类都必须实现这个接口。
2. 具体工厂(Concrete Creator)角色：（AppleFactory、BananaFactory）  
这是实现抽象工厂接口的具体工厂类，负责实例化某个产品族中的产品对象。
3. 抽象产品(Product)角色：（Fruit）  
抽象工厂模式所创建的对象的父类，它负责描述所有实例所共有的公共接口。
4. 具体产品(Concrete Product)角色：（Apple、Banana）  
抽象模式所创建的具体实例对象。
 
抽象工厂中方法对应产品结构，具体工厂对应产品族。