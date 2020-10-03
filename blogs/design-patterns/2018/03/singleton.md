---
title: Java设计模式-----4、单例模式
date: 2018-03-01
tags:
 - 设计模式
categories:
 - 设计模式
prev: ../02/abstract-factory
next: ./prototype
---

&emsp;&emsp;单例模式是一种对象创建型模式，使用单例模式，可以保证为一个类只生成唯一的一个实例对象。也就是说，在整个程序空间中，该类只存在一个实例对象。  
&emsp;&emsp;其实，GoF对单例模式的定义是：保证一个类，只有一个实例存在，同时提供能对该实例加以访问的全局访问方法。  

**那么，我们为什么要用单例模式呢？**  
这是因为在应用系统开发时，我们常常有以下需求：
1. 在多个线程之间，比如servlet环境，共享同一个资源或者操作同一个对象。
2. 在整个程序空间使用全局变量，共享资源。
3. 在大规模系统中，为了性能的考虑，需要节省对象的创建时间等等。
因为单例模式可以保证为一个类只生成唯一的实例对象，所以这些情况，单例模式就派上用场了。  

**单例模式分为几种情况：**  
1. 饿汉式（在类加载时就完成了初始化，所以类加载比较慢，但获取对象的速度快，同时无法做到延时加载） 
``` java
public class Person {
    public static final Person person = new Person();
            
    //构造函数私有化
    private Person(){}
    
    //提供一个全局的静态方法
    public static Person getPerson(){
        return person;
    }
}
```

2. 接下来是懒汉式（在类加载时不初始化，可以延时加载）  
懒汉式可以分为两种，一种线程安全，一种线程不安全  
（1）懒汉式（线程不安全，但效率高）
``` java
public class Person {
    public static Person person = null;

    //构造函数私有化
    private Person(){}
            
    //提供一个全局的静态方法
    public static Person getPerson(){
        if(person == null){
            person = new Person();
        }
        return person;
    }
}
```
（2）懒汉式（线程安全，但效率低）
``` java
public class Person {
    public static Person person = null;

    //构造函数私有化
    private Person(){}

    //提供一个全局的静态方法
    public static synchronized Person getPerson(){
        if(person == null){
            person = new Person();
        }
        return person;
    }
}
```

3. 静态内部类（可以延时加载）  
这种方法是饿汉式的一种升级，这种方式同样利用了classloder的机制来保证初始化instance时只有一个线程，同时实现了延时加载        
``` java
public class Person {
    private static class PersonHolder{
        private static final Person person = new Person();
    }

    //构造函数私有化
    private Person(){}

    //提供一个全局的静态方法  
    public static final Person getPerson(){
        return PersonHolder.person;
    }
}
```

4、双重检查（对懒汉式的升级，效率更高）            
``` java
public class Person {
    public static Person person = null;
            
    //构造函数私有化
    private Person(){}
            
    //提供一个全局的静态方法
    public static Person getPerson(){
        if(person == null){
            synchronized(Person.class){
                if(person == null){
                    person = new Person();
                }
            }
        }
        return person;
    }
}
```
&emsp;&emsp;这样写，只把新建实例的代码放到同步锁中，为了保证线程安全再在同步锁中加一个判断，虽然看起来更繁琐，但是同步中的内容只会执行一次，执行过后，以后经过外层的if判断后，都不会在执行了，所以不会再有阻塞。程序运行的效率也会更加的高。