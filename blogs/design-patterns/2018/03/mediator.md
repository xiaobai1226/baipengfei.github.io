---
title: Java设计模式-----17、中介者模式
date: 2018-03-21 10:17:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./interpreter
next: ./cor
---

**概念：**  
&emsp;&emsp;Mediator模式也叫中介者模式，是由GoF提出的23种软件设计模式的一种。Mediator模式是行为模式之一，在Mediator模式中，类之间的交互行为被统一放在Mediator的对象中，对象通过Mediator对象同其他对象交互，Mediator对象起着控制器的作用。  
&emsp;&emsp;中介者模式其实就好比租房中介和相亲网站一样，房东将信息发布到租房中介，而租客可以中介挑选自己理想的房子，或者单身男女各自将自己的信息发布到相亲网站，同时也可以挑选符合自己条件的另一半。  

&emsp;&emsp;拿相亲网站举个例子，首先不用中介者模式  
&emsp;&emsp;相亲，肯定是人相亲，所以新建一个Person类，并提供一个getCompanion(Person person)方法
``` java
public abstract class Person {
    private String name;
    private int condition;
    
    public Person(String name, int condition){
        this.name = name;
        this.condition = condition;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCondition() {
        return condition;
    }

    public void setCondition(int condition) {
        this.condition = condition;
    }
    
    //得到是否符合信息
    public abstract void getCompanion(Person person);
}
```

人肯定是分为男人和女人，所以在新建Man与Woman类
``` java
public class Man extends Person {

    public Man(String name, int condition) {
        super(name, condition);
    }

    @Override
    public void getCompanion(Person person) {
        if(person instanceof Man){
            System.out.println("我不是gay");
        }else{
            if(person.getCondition() == this.getCondition()){
                System.out.println(this.getName()+"先生与"+person.getName()+"女士"+"非常般配");
            }else{
                System.out.println(this.getName()+"先生与"+person.getName()+"女士"+"不合适");
            }
        }
    }
}

public class Woman extends Person{

    public Woman(String name, int condition) {
        super(name, condition);
    }

    @Override
    public void getCompanion(Person person) {
        if(person instanceof Woman){
            System.out.println("我不是gay");
        }else{
            if(person.getCondition() == this.getCondition()){
                System.out.println(this.getName()+"女士与"+person.getName()+"先生"+"非常般配");
            }else{
                System.out.println(this.getName()+"女士与"+person.getName()+"先生"+"不合适");
            }
        }
    }
}
```

在写一个客户端
``` java
public class MainCLass {
    public static void main(String[] args) {
        Person xiaoming = new Man("小明",1);
        Person xiaoqiang = new Man("小强",2);
        
        Person xiaohong = new Woman("小红",1);
        
        xiaoming.getCompanion(xiaohong);
        
        xiaoqiang.getCompanion(xiaohong);
        
        xiaoming.getCompanion(xiaoqiang);
    }
}
```

运行结果：  
<font color=#0099ff size=3 face="黑体">小明先生与小红女士非常般配</font>  
<font color=#0099ff size=3 face="黑体">小强先生与小红女士不合适</font>  
<font color=#0099ff size=3 face="黑体">我不是gay</font>  

&emsp;&emsp;可以看到，这种形式判断对方是否合适都交给了男女双方自己来解决，自己去寻找是否符合条件的，像大海捞针一样，不管是男，女人，甚至不是人都要挨个去比较。  
&emsp;&emsp;同时这样Man和Woman之间存在了一个交互行为，大大提高了代码的耦合性，如果这两个类中都有自己特定的方法需要对方调用时，只要一方修改，另一方就需要跟着修改。两个类紧紧联系到了一起，这样的设计是很不好的。

下面，正式进入中介者模式  
中介者模式结构图  
![中介者模式结构图](/img/blogs/2018/03/mediator-structure.png)  

**中介者模式的角色和职责**
1. Mediator：中介者类的抽象父类  
抽象中介者角色定义统一的接口，用于各角色（男和女）之间的通信。
2. ConcreteMediator：具体中介者角色  
具体中介者角色，通过协调各角色（男和女）实现协作行为，因此它必须依赖于各个角色。
3. Colleague：关联类的抽象父类  
每一个角色都知道中介者角色，而且与其它的角色通信的时候，一定要通过中介者角色来协作。  
每个类（Person）的行为分为二种（男和女）：一种是男女本身的行为，这种行为叫做自发行为(Self-Method);第二种是必须依赖中介者才能完成的行为，叫做依赖行为(Dep-Method)。
4. concreteColleague：具体的关联类（Man和Woman）。  

下面，用代码实现中介者模式  
首先新建一个Mediator
``` java
public abstract class Mediator {
    private Man man;
    private Woman woman;
    
    public Man getMan() {
        return man;
    }
    public void setMan(Man man) {
        this.man = man;
    }
    public Woman getWoman() {
        return woman;
    }
    public void setWoman(Woman woman) {
        this.woman = woman;
    }
    
    //比较条件的方法
    public abstract void getCompanion(Person person);
}
```

在新建一个ConcreteMediator：具体中介者角色
``` java
public class BlindDateMediator extends Mediator{
    @Override
    public void getCompanion(Person person) {
        if(person instanceof Man) {
            this.setMan((Man)person);
        } else {
            this.setWoman((Woman)person);
        }
        
        //如果是同性
        if(this.getMan() == null || this.getWoman() == null) {
            System.out.println("我不是gay");
        }else {
            //条件合适
            if(this.getMan().getCondition() == this.getWoman().getCondition()) {
                System.out.println(this.getMan().getName() + "先生与" + this.getWoman().getName() + "女士很般配");
            //条件不合适
            }else {
                System.out.println(this.getMan().getName() + "先生" + this.getWoman().getName() + "女士不合适");
            }
        }
         
        //比较之后，将条件置空，不然会影响下一次比较
        this.setMan(null);
        this.setWoman(null);
    }
}
```

接下来，新建Person，Man与Woman
``` java
public abstract class Person {
    private String name;
    private int condition;
    private Mediator mediator;
    
    public Person(String name, int condition, Mediator mediator){
        this.name = name;
        this.condition = condition;
        this.mediator = mediator;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCondition() {
        return condition;
    }
 
    public void setCondition(int condition) {
        this.condition = condition;
    }
    
    public Mediator getMediator() {
        return mediator;
    }

    public void setMediator(Mediator mediator) {
        this.mediator = mediator;
    }

    //得到是否符合信息
    public abstract void getCompanion(Person person);
}

public class Man extends Person {

    public Man(String name, int condition, Mediator mediator) {
        super(name, condition, mediator);
    }
 
    @Override
    public void getCompanion(Person person) {
        this.getMediator().setMan(this);
        this.getMediator().getCompanion(person);
    }
}

public class Woman extends Person{

    public Woman(String name, int condition, Mediator mediator) {
        super(name, condition, mediator);
    }

    @Override
    public void getCompanion(Person person) {
        this.getMediator().setWoman(this);
        this.getMediator().getCompanion(person);
    }
}
```

最后是客户端
``` java
public class MainCLass {
    public static void main(String[] args) {
        Mediator mediator = new BlindDateMediator();
        Person xiaoming = new Man("小明",1,mediator);
        Person lisi = new Man("李四",2,mediator);
        Person xiaohong = new Woman("小红",1,mediator);
        
        xiaoming.getCompanion(xiaohong);
        
        lisi.getCompanion(xiaohong);
        
        xiaoming.getCompanion(lisi);
    }
}
```

运行结果如下：  
<font color=#0099ff size=3 face="黑体">小明先生与小红女士非常般配</font>  
<font color=#0099ff size=3 face="黑体">李四先生与小红女士不合适</font>  
<font color=#0099ff size=3 face="黑体">我不是gay</font>  

**中介者模式的优缺点**  
**优点：**  
1. 将系统按功能分割成更小的对象，符合类的最小设计原则
2. 对关联对象的集中控制
3. 减小类的耦合程度，明确类之间的相互关系：当类之间的关系过于复杂时，其中任何一个类的修改都会影响到其他类，不符合类的设计的开闭原则 ，而Mediator模式将原来相互依存的多对多的类之间的关系简化为Mediator控制类与其他关联类的一对多的关系，当其中一个类修改时，可以对其他关联类不产生影响（即使有修改，也集中在Mediator控制类）。
4. 有利于提高类的重用性  

**缺点：**  
中介者会膨胀得很大，而且逻辑复杂，原本N个对象直接的相互依赖关系转换为中介者和同事类的依赖关系，同事类越多，中介者的逻辑就越复杂。