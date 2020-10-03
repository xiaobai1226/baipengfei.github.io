---
title: Java设计模式-----6、建造者模式
date: 2018-03-05
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./prototype
next: ./decorator
---

&emsp;&emsp;Builder模式也叫建造者模式或者生成器模式，是由GoF提出的23种设计模式中的一种。Builder模式是一种对象创建型模式之一，用来隐藏复合对象的创建过程，它把复合对象的创建过程加以抽象，通过子类继承和重载的方式，动态地创建具有复合属性的对象。
            
建造者模式的结构图：
![建造者模式的结构](/img/blogs/2018/03/builder-structure.png "建造者模式的结构")

**角色**  
在这样的设计模式中，有以下几个角色：
1. builder：为创建一个产品对象的各个部件指定抽象接口。
2. ConcreteBuilder：实现Builder的接口以构造和装配该产品的各个部件，定义并明确它所创建的表示，并提供一个检索产品的接口。
3. Director：构造一个使用Builder接口的对象。
4. Product：表示被构造的复杂对象。ConcreteBuilder创建该产品的内部表示并定义它的装配过程，包含定义组成部件的类，包括将这些部件装配成最终产品的接口。  

首先，举个例子，建造者模式我们比方我们要造个房子。  
房子的图纸：
``` java
public class House {
    //地板
    private String floor;
    //墙
    private String wall;
    //房顶
    private String roof;
    
    public String getFloor() {
        return floor;
    }
    public void setFloor(String floor) {
        this.floor = floor;
    }
    public String getWall() {
        return wall;
    }
    public void setWall(String wall) {
        this.wall = wall;
    }
    public String getRoof() {
        return roof;
    }
    public void setRoof(String roof) {
        this.roof = roof;
    }
}
```
有了图纸后，最笨的方法就是自己造房子  
客户端：        
``` java
public class MainClass {
    public static void main(String[] args) {
        //客户直接造房子
        House house = new House();
        
        house.setFloor("地板");
        house.setWall("墙");
        house.setRoof("屋顶");
        
        System.out.println(house.getFloor());
        System.out.println(house.getWall());
        System.out.println(house.getRoof());
    }
}
```
可是这样的方法不是很好，真正我们造房子都是找施工队，所以我们要把造房子分离出来，交给施工队。  

新建一个施工队，为了扩展性，声明一个施工队的接口
            
``` java
public interface HouseBuilder {
    //修地板
    public void makeFloor();
    //修墙
    public void makeWall();
    //修屋顶
    public void makeRoof();
    //获得修好的房子
    public House getHouse();
}
```

新建一个施工队，实现此接口         
``` java
public class LoufangBuilder implements HouseBuilder{
    House house = new House();
    
    @Override
    public void makeFloor() {
        house.setFloor("楼房->地板");
    }

    @Override
    public void makeWall() {
        house.setWall("楼房->墙");
    }

    @Override
    public void makeRoof() {
        house.setRoof("楼房->屋顶");
    }

    @Override
    public House getHouse() {
        return house;
    }
}
```

客户端           
``` java
public class MainClass {
    public static void main(String[] args) {
        //施工队造房子
        HouseBuilder loufangBuilder = new LoufangBuilder();
        loufangBuilder.makeFloor();
        loufangBuilder.makeWall();
        loufangBuilder.makeRoof();
        
        House house = loufangBuilder.getHouse();
        System.out.println(house.getFloor());
        System.out.println(house.getWall());
        System.out.println(house.getRoof());
    }
}
```
可以看到，这样子造房子就交给施工队了，但可以看到造房子的具体细节还在客户端里  
<font color=#0099ff size=3 face="黑体">loufangBuilder.makeFloor();</font>  
<font color=#0099ff size=3 face="黑体">loufangBuilder.makeWall();</font>  
<font color=#0099ff size=3 face="黑体">loufangBuilder.makeRoof();</font>  

这就相当于我们在指导施工队干活，这肯定不是最好的方案，最好的解决方案，是由一个设计师也可以说是指挥者来指导工程队，所以在新建一个指挥者
``` java
public class HouseDirector {
    private HouseBuilder houseBuilder;
    
    public HouseDirector(HouseBuilder houseBuilder){
        this.houseBuilder = houseBuilder;
    }
    
    public void make(){
        houseBuilder.makeFloor();
        houseBuilder.makeWall();
        houseBuilder.makeRoof();
    }
}
```

客户端          
``` java
public class MainClass {
    public static void main(String[] args) {
        //施工队造房子
        HouseBuilder loufangBuilder = new LoufangBuilder();
//        loufangBuilder.makeFloor();
//        loufangBuilder.makeWall();
//        loufangBuilder.makeRoof();
        HouseDirector houseDirector = new HouseDirector(loufangBuilder);
        houseDirector.make();
        
        House house = loufangBuilder.getHouse();
        System.out.println(house.getFloor());
        System.out.println(house.getWall());
        System.out.println(house.getRoof());
    }
}
```
这样子，把施工队交给这个设计者，施工细节的工作就由这个设计者执行了。
当然，还有一种写法，有一些细微的改动，也是更常用的，就是设计者（Director）不在构造时传入builder，而是在调用方法时，才传入，像这样
            
``` java
public class HouseDirector {
    public void make(HouseBuilder houseBuilder){
        houseBuilder.makeFloor();
        houseBuilder.makeWall();
        houseBuilder.makeRoof();
    }
}
```

客户端        
``` java
public class MainClass {
    public static void main(String[] args) {
        //施工队造房子
        HouseBuilder loufangBuilder = new LoufangBuilder();

        HouseDirector houseDirector = new HouseDirector();
        houseDirector.make(loufangBuilder);
        
        House house = loufangBuilder.getHouse();
        System.out.println(house.getFloor());
        System.out.println(house.getWall());
        System.out.println(house.getRoof());
    }
}
```
这样子，出来的效果是一样的。
这就是一个简单的建造者模式
这样也提高了系统的扩展性与可维护性，如果不想造楼房了，想造一个别墅，只需新增一个别墅施工队就好了，像这样
            
``` java
public class BieshuBuilder implements HouseBuilder{
    House house = new House();
    
    @Override
    public void makeFloor() {
        house.setFloor("别墅->地板");
    }

    @Override
    public void makeWall() {
        house.setWall("别墅->墙");
    }

    @Override
    public void makeRoof() {
        house.setRoof("别墅->屋顶");
    }

    @Override
    public House getHouse() {
        return house;
    }
}
```

客户端只需把施工队换成别墅施工队            
``` java
public class MainClass {
    public static void main(String[] args) {
        //施工队造房子
        HouseBuilder bieshuBuilder = new BieshuBuilder();//只需要修改这里

        HouseDirector houseDirector = new HouseDirector();
        houseDirector.make(bieshuBuilder);
        
        House house = bieshuBuilder.getHouse();
        System.out.println(house.getFloor());
        System.out.println(house.getWall());
        System.out.println(house.getRoof());
    }
}
```

**适用范围：**
1. 对象的创建：Builder模式是为对象的创建而设计的模式
2. 创建的是一个复合对象：被创建的对象为一个具有复合属性的复合对象
3. 关注对象创建的各部分的创建过程：不同的工厂（这里指builder生成器）对产品属性有不同的创建方法