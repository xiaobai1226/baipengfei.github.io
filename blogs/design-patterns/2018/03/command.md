---
title: 设计模式-----23、命令模式
date: 2018-03-27 11:22:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./state
next: ./visitor
---

**概念：**  
&emsp;&emsp;Command模式也叫命令模式 ，是行为设计模式的一种。Command模式通过被称为Command的类封装了对目标对象的调用行为以及调用参数。  
&emsp;&emsp;命令模式（Command Pattern）是一种数据驱动的设计模式，它属于行为型模式。请求以命令的形式包裹在对象中，并传给调用对象。调用对象寻找可以处理该命令的合适的对象，并把该命令传给相应的对象，该对象执行命令。  

**主要解决：**  
&emsp;&emsp;在软件系统中，“行为请求者”与“行为实现者”通常呈现一种“紧耦合”。但在某些场合，比如要对行为进行“记录、撤销/重做、事务”等处理，这种无法抵御变化的紧耦合是不合适的。在这种情况下，如何将“行为请求者”与“行为实现者”解耦？将一组行为抽象为对象，实现二者之间的松耦合。这就是命令模式（Command Pattern）。  

下面，举一个小例子，但不是使用命令模式实现的  
新建一个Peddler类，是一个卖水果的小商贩
``` java
/*
 * 小商贩
 */
public class Peddler {
    /*
     * 卖苹果
     */
    public void sailApple(){
        System.out.println("卖苹果");
    }
    
    /*
     * 卖香蕉
     */
    public void sailBanana(){
        System.out.println("卖香蕉");
    }
}
```

再建一个客户端
``` java
public class MainClass {
    public static void main(String[] args) {
        Peddler peddler = new Peddler();
        peddler.sailApple();
        peddler.sailBanana();
    }
}
```
结果：  
<font color=#0099ff size=3 face="黑体">卖苹果</font>  
<font color=#0099ff size=3 face="黑体">卖香蕉</font>  

**命令模式的应用场景**  
&emsp;&emsp;在面向对象的程序设计中，一个对象调用另一个对象，一般情况下的调用过程是：创建目标对象实例；设置调用参数；调用目标对象的方法（像刚才的例子MainClass中，创建Peddler实例，再调度其中的方法）。  

&emsp;&emsp;但在有些情况下有必要使用一个专门的类对这种调用过程加以封装，我们把这种专门的类称作command类。
1. 整个调用过程比较繁杂，或者存在多处这种调用。这时，使用Command类对该调用加以封装，便于功能的再利用。
2. 调用前后需要对调用参数进行某些处理。
3. 调用前后需要进行某些额外处理，比如日志，缓存，记录历史操作等。  

**命令模式的结构**  
![命令模式结构图](/img/blogs/2018/03/command-structure.png)  

**命令模式的角色和职责**  
1. Command：Command抽象类，定义命令的接口，声明执行的方法。。
2. ConcreteCommand：Command的具体实现类，命令接口实现对象，是“虚”的实现；通常会持有接收者，并调用接收者的功能来完成命令要执行的操作。
3. Receiver：需要被调用的目标对象，接收者，真正执行命令的对象。任何类都可能成为一个接收者，只要它能够实现命令要求实现的相应功能。
4. Invorker：通过Invorker执行Command对象，要求命令对象执行请求，通常会持有命令对象，可以持有很多的命令对象。这个是客户端真正触发命令并要求命令执行相应操作的地方，也就是说相当于使用命令对象的入口。
5. Client：创建具体的命令对象，并且设置命令对象的接收者。注意这个不是我们常规意义上的客户端，而是在组装命令对象和接收者，或许，把这个Client称为装配者会更好理解，因为真正使用命令的客户端是从Invoker来触发执行。  

当然，我们的例子非常简单，用不到命令模式，我们假设操作很复杂，用命令模式改造一下  
首先，创建类对调用过程进行一个封装，先创建一个Command抽象父类
``` java
public abstract class Command {
    //包含一个Receiver的引用
    private Peddler peddler;
    
    public Command(Peddler peddler) {
        super();
        this.peddler = peddler;
    }

    public Peddler getPeddler() {
        return peddler;
    }

    public void setPeddler(Peddler peddler) {
        this.peddler = peddler;
    }

    public abstract void sail();
}
```

接下来创建ConcreteCommand，每一个操作都要创建一个，所以我们要创建两个Apple与Banana
``` java
/*
 * Apple
 */
public class AppleCommand extends Command{

    public AppleCommand(Peddler peddler) {
        super(peddler);
    }

    @Override
    public void sail() {
        //还可以在这句话前后做额外的处理
        this.getPeddler().sailApple();
    }

}

/*
 * Banana
 */
public class BananaCommand extends Command{

    public BananaCommand(Peddler peddler) {
        super(peddler);
    }

    @Override
    public void sail() {
        //还可以在这句话前后做额外的处理
        this.getPeddler().sailBanana();
    }

}
```

最后，修改MainClass
``` java
public class MainClass {
    public static void main(String[] args) {
        Peddler peddler = new Peddler();
        Command appleCommand = new AppleCommand(peddler);
        Command bananaCommand = new BananaCommand(peddler);
        
        appleCommand.sail();
        bananaCommand.sail();
        
    }
}
```

但是这样还不够好，可以看到这是直接由命令来调用sail方法的，这样不好，我们希望由专人来卖东西，就像人家请了一个服务员一样，所以我们再新建一个Invorker
``` java
public class Waiter {
    private Command command;

    public Command getCommand() {
        return command;
    }

    public void setCommand(Command command) {
        this.command = command;
    }
    
    public void sail(){
        command.sail();
    }
}
```
 
再修改客户端
``` java
public class MainClass {
    public static void main(String[] args) {
        Peddler peddler = new Peddler();
        Command appleCommand = new AppleCommand(peddler);
        Command bananaCommand = new BananaCommand(peddler);
        
        Waiter waiter = new Waiter();
        waiter.setCommand(appleCommand);
        waiter.sail();
        
        waiter.setCommand(bananaCommand);
        waiter.sail();
        
    }
}
```
 
这样Client就直接与Invorker进行通话  
我们现在只能添加命令，却不能移除命令，，而且一次只能有一个命令，我们继续改造
``` java
public class Waiter {
    private Map<String,Command> commands;

    public Map<String, Command> getCommands() {
        if(commands == null){
            commands = new HashMap<String,Command>();
        }
        
        return commands;
    }

    public void setCommand(String key, Command command) {
        if(commands == null){
            commands = new HashMap<String,Command>();
        }
        commands.put(key, command);
    }
    
    public void RemoveCommand(String key) {
        commands.remove(key);
    }

    public void sail(String key){
        commands.get(key).sail();
    }
}
```

Client
``` java
public class MainClass {
    public static void main(String[] args) {
        Peddler peddler = new Peddler();
        Command appleCommand = new AppleCommand(peddler);
        Command bananaCommand = new BananaCommand(peddler);
        
        Waiter waiter = new Waiter();
        waiter.setCommand("apple", appleCommand);
        waiter.setCommand("banana", bananaCommand);
        
        waiter.sail("apple");
        waiter.sail("banana");
        
        waiter.RemoveCommand("apple");
        
    }
}
```

这样，就完成了，一个命令模式的例子

**命令模式的优缺点**  
**优点：**  
1. 降低了系统耦合度。
2. 新的命令可以很容易添加到系统中去。

**缺点：**  
使用命令模式可能会导致某些系统有过多的具体命令类。