---
title: 设计模式-----21、备忘录模式
date: 2018-03-26 09:17:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./template-method
next: ./state
---

**概念：**  
&emsp;&emsp;Memento模式也叫备忘录模式又叫做快照模式（Snapshot Pattern）或Token模式，是GoF的23种设计模式之一，属于行为模式，它的作用是保存对象的内部状态，并在需要的时候（undo/rollback）恢复对象以前的状态。  
&emsp;&emsp;在不破坏封闭的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态。这样以后就可将该对象恢复到原先保存的状态。  

**备忘录模式的结构**  
![备忘录模式结构图](/img/blogs/2018/03/memento-structure.png)  

**备忘录模式的角色和职责**  
1. Originator（原生者）：需要被保存状态以便恢复的那个对象，负责创建一个备忘录Memento，用以记录当前时刻自身的内部状态，并可使用备忘录恢复内部状态。Originator可以根据需要决定Memento存储自己的哪些内部状态。
2. Memento（备忘录）：该对象由Originator创建，主要负责存储Originator对象的内部状态，并可以防止Originator以外的其他对象访问备忘录。备忘录有两个接口：Caretaker只能看到备忘录的窄接口，他只能将备忘录传递给其他对象。Originator却可看到备忘录的宽接口，允许它访问返回到先前状态所需要的所有数据。
3. Caretaker（管理者）：负责在适当的时间保存/恢复Originator对象的状态，负责备忘录Memento，不能对Memento的内容进行访问或者操作。  

**备忘录模式的应用场景**  
如果一个对象需要保存状态并可通过undo或rollback等操作恢复到以前的状态时，可以使用Memento模式。
1. 一个类需要保存它的对象的状态（相当于Originator角色）
2. 设计一个类，该类只是用来保存上述对象的状态（相当于Memento角色）
3. 需要的时候，Caretaker角色要求Originator返回一个Memento并加以保存
4. undo或rollback操作时，通过Caretaker保存的Memento恢复Originator对象的状态  

下面用代码来实现一下  
首先，新建一个Person类，他就是Originator（原生者）  
```java
/*
 * Originator（原生者）
 */
public class Person {
    /*
     * 姓名，年龄，性别就是结构图中的state，状态属性
     */
    //姓名
    private String name;
    //年龄
    private int age;
    //性别
    private String sex;

    public Person() {
        super();
    }

    public Person(String name, int age, String sex) {
        super();
        this.name = name;
        this.age = age;
        this.sex = sex;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }
    
    public void display() {
        System.out.println("name:" + name + ",sex:" + sex + ",age:" + age);
    }
    
    //创建一个备份
    public Memento createMemento(){
        return new Memento(name,age,sex);
    }
    
    //恢复一个备份
    public void setMemento(Memento memento){
        this.name = memento.getName();
        this.age = memento.getAge();
        this.sex = memento.getSex();
    }
}
```
 
接着，创建一个Memento（备忘录），他和Originator的基本结构是一样的
```java
/*
 * Memento（备忘录）
 */
public class Memento {
    //姓名
    private String name;
    //年龄
    private int age;
    //性别
    private String sex;

    public Memento() {
        super();
    }

    public Memento(String name, int age, String sex) {
        super();
        this.name = name;
        this.age = age;
        this.sex = sex;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }
}
```
 
接下来，创建客户端运行一下
```java
public class MainClass {
    public static void main(String[] args) {
        Person person = new Person("小明",18,"男");
        //打印
        person.display();
        
        //创建一个备份
        Memento memento = person.createMemento();
        
        person.setName("小红");
        person.setAge(17);
        person.setSex("女");
        //打印
        person.display();
        
        //备份还原
        person.setMemento(memento);
        //打印
        person.display();
    }
}
```
结果：  
<font color=#0099ff size=3 face="黑体">name：小明，sex：男，age：18</font>  
<font color=#0099ff size=3 face="黑体">name：小红，sex：女，age：17</font>  
<font color=#0099ff size=3 face="黑体">name：小明，sex：男，age：18</font>  

这样，就做到了一个备份还原的过程，但是可以看到，根据结构图看，我们还缺少了一个Caretaker（管理者）角色  
这个角色的作用其实就是把备份还原的过程交到管理者手中，通过管理者来备份还原
```java
/*
 * Caretaker（管理者）
 */
public class Caretaker {
    //持有一个对Memento的引用
    private Memento memento;

    public Memento getMemento() {
        return memento;
    }

    public void setMemento(Memento memento) {
        this.memento = memento;
    }
}
```
 
客户端
```java
public class MainClass {
    public static void main(String[] args) {
        Person person = new Person("小明",18,"男");
        //打印
        person.display();
        
        //创建一个管理者
        Caretaker caretaker = new Caretaker();
        
        //创建一个备份
//        Memento memento = person.createMemento();
        caretaker.setMemento(person.createMemento());
        
        person.setName("小红");
        person.setAge(17);
        person.setSex("女");
        //打印
        person.display();
        
        //备份还原
        person.setMemento(caretaker.getMemento());
        //打印
        person.display();
    }
}
```
运行结果是一样的  

**备忘录模式的优点和缺点**  
**备忘录模式的优点**  
1. 有时一些发起人对象的内部信息必须保存在发起人对象以外的地方，但是必须要由发起人对象自己读取，这时，使用备忘录模式可以把复杂的发起人内部信息对其他的对象屏蔽起来，从而可以恰当地保持封装的边界。
2. 本模式简化了发起人类。发起人不再需要管理和保存其内部状态的一个个版本，客户端可以自行管理他们所需要的这些状态的版本。
3. 当发起人角色的状态改变的时候，有可能这个状态无效，这时候就可以使用暂时存储起来的备忘录将状态复原。  

**备忘录模式的缺点：**  
1. 如果发起人角色的状态需要完整地存储到备忘录对象中，那么在资源消耗上面备忘录对象会很昂贵。
2. 当负责人角色将一个备忘录存储起来的时候，负责人可能并不知道这个状态会占用多大的存储空间，从而无法提醒用户一个操作是否很昂贵。
3. 当发起人角色的状态改变的时候，有可能这个协议无效。如果状态改变的成功率不高的话，不如采取“假如”协议模式。