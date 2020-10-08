---
title: 设计模式-----11、代理模式
date: 2018-03-14 10:45:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./flyweight
next: ./facade
---

&emsp;&emsp;Proxy模式又叫做代理模式，是构造型的设计模式之一，它可以为其他对象提供一种代理（Proxy）以控制对这个对象的访问。  
&emsp;&emsp;所谓代理，是指具有与代理元（被代理的对象）具有相同的接口的类，客户端必须通过代理与被代理的目标类交互，而代理一般在交互的过程中（交互前后），进行某些特别的处理。
  
**代理模式的结构**
![代理模式的结构图](/img/blogs/2018/03/proxy-structure.png)  

**代理模式的角色与职责**  
1. subject（抽象主题角色）：真实主题与代理主题的共同接口或抽象类。
2. RealSubject（真实主题角色）：定义了代理角色所代表的真实对象。
3. Proxy（代理主题角色）：含有对真实主题角色的引用，代理角色通常在将客户端调用传递给真是主题对象之前或者之后执行某些操作，而不是单纯返回真实的对象。

**举个例子说明一下代理模式**  
&emsp;&emsp;比如说买书，网上有很多专门卖书的网站，我们从这些商城买书，但是书不是这些商城印的，他们只负责卖，书是出版社印的，所以说到底，我们其实还是从出版社买书，网上书城只是出版社的代理，所以出版社是被代理对象，书城是代理对象。  
&emsp;&emsp;所以，根据角色与职责划分，subject（抽象主题角色）就是卖书，卖书是书城与出版社的共同功能，RealSubject（真实主题角色）就是出版社，它的功能就是卖书，但不直接卖给用户，而是被书城代理，通过代理来卖，Proxy（代理主题角色）就是书城，根据概念发现，代理对象在代理的过程中不仅仅只有被代理对象的功能，他还会执行某些他自己的操作，这个意思是，比如，书城会推出优惠券与打折活动。在卖书的基础上，增加许多功能来吸引消费者。

接下来，我们用代码实现刚才的例子：  
代理模式分为两种类型：（1）静态代理（2）动态代理
1. **静态代理**
（静态代理在使用时,需要定义接口或者父类,被代理对象与代理对象一起实现相同的接口或者是继承相同父类）  
首先，创建subject，一个接口，是代理对象与被代理对象的共同接口  

书城与出版社都有卖书的功能
``` java
public interface Subject {
    public void sailBook();
}
```
 
 然后，创建RealSubject，被代理对象，也就是出版社
``` java
public class RealSubject implements Subject {
    @Override
    public void sailBook() {
        System.out.println("卖书");
    }

}
```

然后，创建代理对象，也就是书城
``` java
public class ProxySubject implements Subject{
   //代理对象含有对真实主题角色的引用
   private Subject subject;
   
   public ProxySubject(Subject subject){
       this.subject = subject;
   }

   @Override
   public void sailBook() {
       dazhe();
       this.subject.sailBook();
       give();
   }
    
   //代理角色通常在将客户端调用传递给真是主题对象之前或者之后执行某些操作，而不是单纯返回真实的对象。
   public void dazhe(){
       System.out.println("打折");
   }
    
   public void give(){
       System.out.println("赠送代金券");
   }
}
```

最后，创建客户端，也就是用户  

首先如果，不使用代理直接从出版社买
``` java
public class MainClass {
    public static void main(String[] args) {
        Subject realSubject = new RealSubject();
        realSubject.sailBook();
    }
}
```

结果如下：仅仅是卖书  
<font color=#0099ff size=3 face="黑体">卖书</font>  
而如果我们通过代理也就是书城来买
``` java
public class MainClass {
    public static void main(String[] args) {
        Subject realSubject = new RealSubject();
        Subject proxySubject = new ProxySubject(realSubject);
        proxySubject.sailBook();
    }
}
```
结果变成了这样，作为用户，我们享受了更多的优惠，所以我们当然更愿意通过代理来买  
<font color=#0099ff size=3 face="黑体">打折</font>  
<font color=#0099ff size=3 face="黑体">卖书</font>  
<font color=#0099ff size=3 face="黑体">赠送代金券</font>  

**静态代理总结：**  
1. 可以做到在不修改目标对象的功能前提下,对目标功能扩展.
2. 缺点:因为代理对象需要与目标对象实现一样的接口,所以会有很多代理类,类太多.同时,一旦接口增加方法,目标对象与代理对象都要维护.

**如何解决静态代理中的缺点呢?答案是可以使用动态代理方式**  

**（2）动态代理**  
**动态代理有以下特点:**
1. 代理对象,不需要实现接口
2. 代理对象的生成,是利用JDK的API,动态的在内存中构建代理对象(需要我们指定创建代理对象/目标对象实现的接口的类型)
3. 动态代理也叫做:JDK代理,接口代理

代理代理，Subject与RealSubject不变

而使用动态代理，首先要创建代理实例的调用处理程序，通过这个程序来执行代理对象特有的方法  
创建MyHandler实现InvocationHandler（是代理实例的调用处理程序 实现的接口）这个接口，并覆盖invoke(Object proxy, Method method, Object[] args)这个方法。

|方法|返回类型|描述|
|-|-|-|
|invoke(Object proxy, Method method, Object[] args)|Object|在代理实例上处理方法调用并返回结果。|

``` java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

public class MyHandler implements InvocationHandler{
    //这里也需要传入被代理对象
    private Subject subject;
    
    public MyHandler(Subject subject){
        this.subject = subject;
    }
    
    //这个方法中就是代理对象要执行的方法
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        dazhe();
        //执行被代理对象中的方法
        Object result = method.invoke(subject, args);
        give();
        return result;
    }
    
    public void dazhe() {
        System.out.println("打折");
    }
    
    public void give() {
        System.out.println("赠送代金券");
    }
}
```
 
最后，写客户端，客户端中需要动态创建代理对象，要使用Proxy类中的newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler h)方法

|方法|返回类型|描述|
|-|-|-|
|newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler h)|static Object|返回一个指定接口的代理类实例，该接口可以将方法调用指派到指定的调用处理程序。|
**参数：**  
loader - 定义代理类的类加载器  
interfaces - 代理类要实现的接口列表  
h - 指派方法调用的调用处理程序  

**返回：**  
一个带有代理类的指定调用处理程序的代理实例，它由指定的类加载器定义，并实现指定的接口  

**抛出：**  
IllegalArgumentException - 如果违反传递到 getProxyClass 的参数上的任何限制  
NullPointerException - 如果 interfaces 数组参数或其任何元素为 null，或如果调用处理程序 h 为 null  

所以三个参数，第一个是RealSubject的类加载器，第二个是被代理类要实现的接口列表，第三个就是处理程序也就是MyHandler  

``` java
public class MainClass {
    public static void main(String[] args) {
        Subject realSubject = new RealSubject();
        MyHandler myHandler = new MyHandler(realSubject);
        //创建代理对象实例
        Subject proxySubject = (Subject) Proxy.newProxyInstance(Subject.class.getClassLoader(), realSubject.getClass().getInterfaces(), myHandler);
        proxySubject.sailBook();
    }
}
```

结果是相同的  
<font color=#0099ff size=3 face="黑体">打折</font>  
<font color=#0099ff size=3 face="黑体">卖书</font>  
<font color=#0099ff size=3 face="黑体">赠送代金券</font>  

**总结:代理对象不需要实现接口,但是目标对象一定要实现接口,否则不能用动态代理**