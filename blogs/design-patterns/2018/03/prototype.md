---
title: 设计模式-----5、原型模式
date: 2018-03-02 09:32:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./singleton
next: ./builder
---

&emsp;&emsp;原型（Prototype）模式是一种对象创建型模式，他采取复制原型对象的方法来创建对象的实例。使用原型模式创建的实例，具有与原型一样的数据。  

**原型模式的特点：**
1. 由原型对象自身创建目标对象。也就是说，对象创建这一动作发自原型对象本身。
2. 目标对象是原型对象的一个克隆。也就是说，通过原型模式创建的对象，不仅仅与原型对象具有相同的结构，还与原型对象具有相同的值。
3. 根据对象克隆深度层次的不同，有浅度克隆与深度克隆。  

先写一个支持克隆的类：
``` java
//如果要克隆就必须实现Cloneable接口
public class Person implements Cloneable{
    //可能会抛出不支持克隆异常，原因是没有实现Cloneable接口
    @Override
    protected Person clone(){
        try{
            return (Person) super.clone();
        }catch(CloneNotSupportedException e){
            e.printStackTrace();
            return null;
        }
    }
}
```
这个样子，就说明这个类可以克隆了。
            
这样克隆      
``` java
public class MainClass {
    public static void main(String[] args) {
        Person person1 = new Person();
        Person person2 = person1.clone();
    }
}
```
&emsp;&emsp;这样子克隆并不等同于Person p2 = p1；像Person p2 = p1；指的是在栈中创建一个变量p2，将p1的内存地址赋给p2，其实指的是同一个对象。而克隆是复制出一份一模一样的对象，两个对象内存地址不同，但对象中的结构与属性值一模一样。             
&emsp;&emsp;这种不通过 new 关键字来产生一个对象，而是通过对象拷贝来实现的模式就叫做原型模式，这个模式的核心是一个clone( )方法，通过这个方法进行对象的拷贝，Java 提供了一个 Cloneable 接口来标示这个对象是可拷贝的，为什么说是“标示”呢？翻开 JDK 的帮助看看 Cloneable 是一个方法都没有的，这个接口只是一个标记作用，在 JVM 中具有这个标记的对象才有可能被拷贝，所以覆盖了覆盖clone()方法就可以了。  
&emsp;&emsp;在 clone()方法上增加了一个注解@Override， 没有继承一个类为什么可以重写呢？在 Java 中所有类的父类是Object 类，每个类默认都是继承了这个类，所以这个用上@Override是非常正确的。  
&emsp;&emsp;原型模式虽然很简单，但是在 Java 中使用原型模式也就是 clone 方法还是有一些注意事项的，即**对象拷贝时，类的构造函数是不会被执行的**。 一个实现了 Cloneable 并重写了 clone 方法的类 A,有一个无参构造或有参构造 B，通过 new 关键字产生了一个对象 S，再然后通过 S.clone()方式产生了一个新的对象 T，那么在对象拷贝时构造函数 B 是不会被执行的， 对象拷贝时确实构造函数没有被执行，这个从原理来讲也是可以讲得通的，Object 类的 clone 方法的 原理是从内存中（具体的说就是堆内存）以二进制流的方式进行拷贝，重新分配一个内存块，那构造函数 没有被执行也是非常正常的了。        

还有就是深度克隆与浅度克隆  
首先，是浅度克隆   
``` java
//如果要克隆就必须实现Cloneable接口
public class Person implements Cloneable{
    private String name;
    private String sex;
    private List<String> list;
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getSex() {
        return sex;
    }
    public void setSex(String sex) {
        this.sex = sex;
    }
    public List<String> getList() {
        return list;
    }
    public void setList(List<String> list) {
        this.list = list;
    }
    //可能会抛出不支持克隆异常，原因是没有实现Cloneable接口
    @Override
    protected Person clone(){
        try{
            return (Person) super.clone();
        }catch(CloneNotSupportedException e){
            e.printStackTrace();
            return null;
        }
    }
}
```
&emsp;&emsp;这就是浅度克隆，当被克隆的类中有引用对象（String或Integer等包装类型除外）时，克隆出来的类中的引用变量存储的还是之前的内存地址，也就是说克隆与被克隆的对象是同一个。这样的话两个对象共享了一个私有变量，所有人都可以改，是一个种非常不安全的方式，在实际项目中使用还是比较少的。
            
所以就要说到深度拷贝
``` java
//如果要克隆就必须实现Cloneable接口
public class Person implements Cloneable{
    private String name;
    private String sex;
    private List<String> list;
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getSex() {
        return sex;
    }
    public void setSex(String sex) {
        this.sex = sex;
    }
    public List<String> getList() {
        return list;
    }
    public void setList(List<String> list) {
        this.list = list;
    }
    //可能会抛出不支持克隆异常，原因是没有实现Cloneable接口
    @Override
    protected Person clone(){
        try{
            Person person = (Person) super.clone();
            List<String> newList = new ArrayList();
    
            for(String str : this.list){
                newList.add(str);
            }
            person.setList(newList);
            return person;
        }catch(CloneNotSupportedException e){
            e.printStackTrace();
            return null;
        }
    }
}
```
这样就完成了深度拷贝，两种对象互为独立，属于单独对象。    
**注意：final 类型修饰的成员变量不能进行深度拷贝**
            
最后说一下，原型模式的使用场景：
1. 在创建对象的时候，我们不只是希望被创建的对象继承其基类的基本结构，还希望继承原型对象的数据。
2. 希望对目标对象的修改不影响既有的原型对象（深度克隆的时候可以完全互不影响）。
3. 隐藏克隆操作的细节，很多时候，对对象本身的克隆需要涉及到类本身的数据细节。
4. 类初始化需要消化非常多的资源，这个资源包括数据、硬件资源等；
5. 通过 new 产生一个对象需要非常繁琐的数据准备或访问权限，则可以使用原型模式；
6. 一个对象需要提供给其他对象访问，而且各个调用者可能都需要修改其值时，可以考虑使用原型模式拷贝多个对象供调用者使用。在实际项目中，原型模式很少单独出现，一般是和工厂方法模式一起出现，通过 clone的方法创建一个对象，然后由工厂方法提供给调用者。原型模式先产生出一个包含

大量共有信息的类，然后可以拷贝出副本，修正细节信息，建立了一个完整的个性对象。