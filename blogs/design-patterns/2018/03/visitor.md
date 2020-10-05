---
title: Java设计模式-----24、访问者模式
date: 2018-03-27 16:01:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./command
next: ./ocp
---

**概念：**  
&emsp;&emsp;Visitor模式也叫访问者模式，是行为模式之一，它分离对象的数据和行为，使用Visitor模式，可以不修改已有类的情况下，增加新的操作。  

**访问者模式的应用示例**  
&emsp;&emsp;比如有一个公园，有一到多个不同的组成部分；该公园存在多个访问者：清洁工A负责打扫公园的A部分，清洁工B负责打扫公园的B部分，公园的管理者负责检点各项事务是否完成，上级领导可以视察公园等等。也就是说，对于同一个公园，不同的访问者有不同的行为操作，而且访问者的种类也可能需要根据时间的推移而变化（行为的扩展性）。根据软件设计的开闭原则（对修改关闭，对扩展开放），我们怎么样实现这种需求呢？  

**访问者模式的结构**  
![访问者模式结构图](/img/blogs/2018/03/visitor-structure.png)  

**访问者模式的角色和职责**  
1. 访问者角色（Visitor）：为该对象结构中具体元素角色声明一个访问操作接口。该操作接口的名字和参数标识了发送访问请求给具体访问者的具体元素角色。这样访问者就可以通过该元素角色的特定接口直接访问它。
2. 具体访问者角色（Concrete Visitor）：实现每个由访问者角色（Visitor）声明的操作。
3. 元素角色（Element）：定义一个Accept操作，它以一个访问者为参数。
4. 具体元素角色（Concrete Element）：实现由元素角色提供的Accept操作。
5. 对象结构角色（Object Structure）：这是使用访问者模式必备的角色。它要具备以下特征：能枚举它的元素；可以提供一个高层的接口以允许该访问者访问它的元素；可以是一个复合（组合模式）或是一个集合，如一个列表或一个无序集合。  
 
下面，用代码来实现一下访问者模式  
首先，先新建一个公园的各个组成部分（因为有了各个组成部分才能有公园，所以我们先建各个组成部分，再建公园）  
新建一个公园各个部分的抽象类（元素角色Element），需要传入一个访问者，一会后面会创建访问者
``` java
/*
 * 公园每一部分的抽象
 */
public interface ParkElement {
    //用来接纳访问者
    public void accept(Visitor visitor);
}
```

再新建公园的各个部分，这是具体元素角色（Concrete Element）  
关键代码：在数据基础类里面有一个方法接受访问者，将自身引用传入访问者。  
``` java
public class ParkA implements ParkElement{

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

}

public class ParkB implements ParkElement{

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }

}
```

有了公园的各个部分，我们就可以开始新建公园了，这就是对象结构角色（Object Structure）
``` java
/*
 * 整个公园，其中包含了公园的各个部分
 */
public class Park implements ParkElement{
    private ParkA parkA;
    private ParkB parkB;
    
    public Park() {
        super();
        this.parkA = new ParkA();
        this.parkB = new ParkB();
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
        parkA.accept(visitor);
        parkB.accept(visitor);
    }

}
```

有了公园，我们就可以开始建造访问者了，先建造访问者角色（Visitor）
``` java
/*
 * 其中包含访问公园不同区域的重载方法,其中重载的参数Park，ParkA，PArkB，不仅可以获得公园的信息，还用来作为重载的条件
 */
public interface Visitor {
    public void visit(Park park);
    public void visit(ParkA parkA);
    public void visit(ParkB parkB);
}
```

然后在建造具体访问者角色，就是具体访问者角色（Concrete Visitor）
``` java
/*
 * 清洁工A负责公园A的清洁情况
 */
public class VisitorA implements Visitor{

    @Override
    public void visit(Park park) {
    }

    @Override
    public void visit(ParkA parkA) {
        System.out.println("清洁工A完成了公园A的卫生");
    }

    @Override
    public void visit(ParkB parkB) {
    }

}

/*
 * 清洁工B负责公园B的清洁情况
 */
public class VisitorB implements Visitor{

    @Override
    public void visit(Park park) {
    }

    @Override
    public void visit(ParkA parkA) {
    }

    @Override
    public void visit(ParkB parkB) {
        System.out.println("清洁工B完成了公园B的卫生");
    }

}

/*
 * 公园管理员负责检查整个公园的卫生情况
 */
public class VisitorManager implements Visitor{

    @Override
    public void visit(Park park) {
        System.out.println("管理员：负责公园的卫生检查");
    }

    @Override
    public void visit(ParkA parkA) {
        System.out.println("管理员：负责公园A部分的卫生检查");
    }

    @Override
    public void visit(ParkB parkB) {
        System.out.println("管理员：负责公园B部分的卫生检查");
    }

}
```

最后，新建一个客户端
``` java
public class MainClass {
    public static void main(String[] args) {
        Park park = new Park();
        
        Visitor visitorA = new VisitorA();
        park.accept(visitorA);
        
        Visitor visitorB = new VisitorB();
        park.accept(visitorB);
        
        VisitorManager visitorManager = new VisitorManager();
        park.accept(visitorManager);
    }
}
```
结果：  
<font color=#0099ff size=3 face="黑体">清洁工A完成了公园A的卫生</font>  
<font color=#0099ff size=3 face="黑体">清洁工B完成了公园B的卫生</font>  
<font color=#0099ff size=3 face="黑体">管理员：负责公园的卫生检查</font>  
<font color=#0099ff size=3 face="黑体">管理员：负责公园A部分的卫生检查</font>  
<font color=#0099ff size=3 face="黑体">管理员：负责公园B部分的卫生检查</font>  

这样，一个访问者模式的例子就完成了，一定把上面的程序看懂  

**访问者模式的使用意图：**  
主要将数据结构与数据操作分离，解决了稳定的数据结构和易变的操作耦合问题。  

**访问者模式的使用场景：**  
需要对一个对象结构中的对象进行很多不同的并且不相关的操作，而需要避免让这些操作"污染"这些对象的类，使用访问者模式将这些封装到类中。  
1. 对象结构中对象对应的类很少改变，但经常需要在此对象结构上定义新的操作。
2. 需要对一个对象结构中的对象进行很多不同的并且不相关的操作，而需要避免让这些操作"污染"这些对象的类，也不希望在增加新操作时修改这些类。  

**访问者模式的优缺点：**  
**优点：**  
1. 符合单一职责原则。
2. 优秀的扩展性。
3. 灵活性。  

**缺点：**   
1. 具体元素对访问者公布细节，违反了迪米特原则。
2. 具体元素变更比较困难。
3. 违反了依赖倒置原则，依赖了具体类，没有依赖抽象。  

**注意事项：**    
访问者可以对功能进行统一，可以做报表、UI、拦截器与过滤器。