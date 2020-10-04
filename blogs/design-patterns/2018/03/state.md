---
title: Java设计模式-----22、状态模式
date: 2018-03-26 15:58:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./memento
next: 
---

**概念：**  
&emsp;&emsp;State模式也叫状态模式，是行为设计模式的一种。State模式允许通过改变对象的内部状态而改变对象的行为，这个对象表现得就好像修改了它的类一样。  

根据这个概念，我们举个例子  

``` java
public class Behavior {
    private int time;

    public int getTime() {
        return time;
    }

    public void setTime(int time) {
        this.time = time;
    }
    
    public void eat(){
        if(time == 7){
            System.out.println("吃早饭");
        }else if(time == 12){
            System.out.println("吃午饭");
        }else if(time == 18){
            System.out.println("吃晚饭");
        }else{
            System.out.println("还不到吃饭时间");
        }
    }
}

public class MainClass {
    public static void main(String[] args) {
        Behavior behavior = new Behavior();
        behavior.setTime(7);
        behavior.eat();
        
        behavior.setTime(12);
        behavior.eat();
        
        behavior.setTime(18);
        behavior.eat();
        
        behavior.setTime(20);
        behavior.eat();
    }
}
```
结果：  
<font color=#0099ff size=3 face="黑体">吃早饭</font>  
<font color=#0099ff size=3 face="黑体">吃午饭</font>  
<font color=#0099ff size=3 face="黑体">吃晚饭</font>  
<font color=#0099ff size=3 face="黑体">还不到吃饭时间</font>  

&emsp;&emsp;可以看到，根据time属性的不同，对象的行为也发生了改变，但是这样的方式很不好，所有的事情都放到了eat（）方法中，导致eat（）方法过于复杂。  

下面就看一看状态模式  

**状态模式的应用场景**  
&emsp;&emsp;状态模式主要解决的是当控制一个对象状态转换的条件表达式过于复杂时的情况。把状态的判断逻辑转译到表现不同状态的一系列类当中，可以把复杂的判断逻辑简化。  

**简单来说：**
1. 一个对象的行为取决于它的状态，并且它必须在运行时刻根据状态改变它的行为。
2. 一个操作中含有庞大的多分支结构，并且这些分支决定于对象的状态。  

**状态模式的结构**  
![状态模式结构图](/img/blogs/2018/03/state.png)  

**状态模式的角色和职责**  
1. Context：用户对象：拥有一个State类型的成员，以标识对象的当前状态（Behavior）。
2. State：接口或基类封装与Context的特定状态相关的行为。
3. ConcreteState：接口实现类或子类实现了一个与Context某个状态相关的行为。  

按照状态模式，我们来改造一下，刚才的例子，吃早中晚饭，不是吃饭时间，都是状态，所以我们把状态单独封装出来。

首先，新建一个State
``` java
public abstract class State {
    public abstract void eat();
}
```

接着新建ConcreteState
``` java
/*
 * 早餐
 */
public class BreakfastState extends State {

    @Override
    public void eat() {
        System.out.println("吃早餐");
    }
}

/*
 * 午餐
 */
public class LunchState extends State {

    @Override
    public void eat() {
        System.out.println("吃午餐");
    }
}

/*
 * 晚餐
 */
public class DinnerState extends State {

    @Override
    public void eat() {
        System.out.println("吃晚餐");
    }
}

/*
 * 不是吃饭时间
 */
public class NoFoodState extends State {

    @Override
    public void eat() {
        System.out.println("不是吃饭时间");
    }

}
```

再修改一下behavior
``` java
public class Behavior {
    private int time;
    State state  = null;

    public int getTime() {
        return time;
    }

    public void setTime(int time) {
        this.time = time;
    }
    
    public void eat(){
        if(time == 7){
            state = new BreakfastState();
            state.eat();
        }else if(time == 12){
            state = new LunchState();
            state.eat();
        }else if(time == 18){
            state = new DinnerState();
            state.eat();
        }else{
            state = new NoFoodState();
            state.eat();
        }
    }
}
```

这样，和刚才的结果一样，但是这样子，判断逻辑还是在对象中，我们继续修改，将逻辑写到ConcreteState中  
因为，我们要知道time，所以需要向state中传入参数，所以我们将Behavior传进去
``` java
public abstract class State {
    public abstract void eat(Behavior behavior);
}
```

然后，修改Behavior
``` java
public class Behavior {
    private int time;
    State state  = null;

    public Behavior() {
        state = new BreakfastState();
    }

    public int getTime() {
        return time;
    }

    public void setTime(int time) {
        this.time = time;
    }
    
    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public void eat(){
        //逻辑取出，所以这里只剩调用方法
        state.eat(this);
        //当所有方法都完成后，回到最初始状态
        state = new BreakfastState();
    }
}
```

接着，再继续修改每一个ConcreteState
``` java
/*
 * 早餐
 */
public class BreakfastState extends State {

    @Override
    public void eat(Behavior behavior) {
        if(behavior.getTime() == 7){
            System.out.println("吃早餐");
        }else{
            //如果不符合条件，重置state为下一个状态
            behavior.setState(new LunchState());
            behavior.eat();
        }
    }
}

/*
 * 午餐
 */
public class LunchState extends State {

    @Override
    public void eat(Behavior behavior) {
        if(behavior.getTime() == 12){
            System.out.println("吃午餐");
        }else{
            behavior.setState(new DinnerState());
            behavior.eat();
        }
    }
}

/*
 * 晚餐
 */
public class DinnerState extends State {

    @Override
    public void eat(Behavior behavior) {
        if(behavior.getTime() == 18){
            System.out.println("吃晚餐");
        }else{
            behavior.setState(new NoFoodState());
            behavior.eat();
        }
    }
}

/*
 * 不是吃饭时间
 */
public class NoFoodState extends State {

    @Override
    public void eat(Behavior behavior) {
        System.out.println("不是吃饭时间");
    }

}
```
这样，结果和之前是一样的

**状态模式的优点与缺点**  
**优点：**  
1. 封装了转换规则。
2. 枚举可能的状态，在枚举状态之前需要确定状态种类。
3. 将所有与某个状态有关的行为放到一个类中，并且可以方便地增加新的状态，只需要改变对象状态即可改变对象的行为。
4. 允许状态转换逻辑与状态对象合成一体，而不是某一个巨大的条件语句块。
5. 可以让多个环境对象共享一个状态对象，从而减少系统中对象的个数。  

**缺点：**  
1. 状态模式的使用必然会增加系统类和对象的个数。
2. 状态模式的结构与实现都较为复杂，如果使用不当将导致程序结构和代码的混乱。
3. 状态模式对"开闭原则"的支持并不太好，对于可以切换状态的状态模式，增加新的状态类需要修改那些负责状态转换的源代码，否则无法切换到新增状态，而且修改某个状态类的行为也需修改对应类的源代码。  

**注意事项：** 在行为受状态约束的时候使用状态模式，而且状态不超过 5 个。