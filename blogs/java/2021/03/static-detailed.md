---
title: static修饰符详解
date: 2021-03-16 00:03:00
sidebar: 'auto'
tags:
 - Java基础
categories:
 - Java
---

## 1. 概述
&emsp;&emsp;static表示“全局”或者“静态”的意思，用来修饰成员变量和成员方法，也可以形成静态static代码块，但是Java语言中没有全局变量的概念。  
&emsp;&emsp;被static修饰的成员变量和成员方法独立于该类的任何对象。也就是说，它不依赖类特定的实例，被类的所有实例共享。  
&emsp;&emsp;只要这个类被加载，Java虚拟机就能根据类名在运行时数据区的方法区内定找到他们。因此，static对象可以在它的任何对象创建之前访问，无需引用任何对象。  
&emsp;&emsp;用public修饰的static成员变量和成员方法本质是全局变量和全局方法，当声明它类的对象市，不生成static变量的副本，而是类的所有实例共享同一个static变量。  
&emsp;&emsp;static变量前可以有private修饰，表示这个变量可以在类的静态代码块中，或者类的其他静态成员方法中使用（当然也可以在非静态成员方法中使用--废话），但是不能在其他类中通过类名来直接引用，这一点很重要。实际上你需要搞明白，private是访问权限限定，static表示不要实例化就可以使用，这样就容易理解多了。static前面加上其它访问权限关键字的效果也以此类推。  
&emsp;&emsp;static修饰的成员变量和成员方法习惯上称为静态变量和静态方法，可以直接通过类名来访问，访问语法为：  
> 类名.静态方法名(参数列表...)  
> 类名.静态变量名  

用static修饰的代码块表示静态代码块，当Java虚拟机（JVM）加载类时，就会执行该代码块。

## 2. static变量
按照是否静态的对类成员变量进行分类可分两种：一种是被static修饰的变量，叫静态变量或类变量；另一种是没有被static修饰的变量，叫实例变量。  
两者的区别是：
对于静态变量在内存中只有一个拷贝（节省内存），JVM只为静态分配一次内存，在加载类的过程中完成静态变量的内存分配，可用类名直接访问（方便），当然也可以通过对象来访问（但是这是不推荐的）。
对于实例变量，每创建一个实例，就会为实例变量分配一次内存，实例变量可以在内存中有多个拷贝，互不影响（灵活）。
所以一般在需要实现以下两个功能时使用静态变量： - 在对象之间共享值时 - 方便访问变量时

## 3. 静态方法
静态方法可以直接通过类名调用，任何的实例也都可以调用， 因此静态方法中不能用this和super关键字，不能直接访问所属类的实例变量和实例方法(就是不带static的成员变量和成员成员方法)，只能访问所属类的静态成员变量和成员方法。 因为实例成员与特定的对象关联！！

因为static方法独立于任何实例，因此static方法必须被实现，而不能是抽象的abstract。

例如为了方便方法的调用，Java API中的Math类中所有的方法都是静态的，而一般类内部的static方法也是方便其它类对该方法的调用。

静态方法是类内部的一类特殊方法，只有在需要时才将对应的方法声明成静态的，一个类内部的方法一般都是非静态的。

## 4. static代码块
static代码块也叫静态代码块，是在类中独立于类成员的static语句块，可以有多个，位置可以随便放，它不在任何的方法体内，JVM加载类时会执行这些静态的代码块，如果static代码块有多个，JVM将按照它们在类中出现的先后顺序依次执行它们，每个代码块只会被执行一次。例如：

``` java
public class Test5 {
private static int a;
private int b;
static{
Test5.a=3;
System.out.println(a);
Test5 t=new Test5();
t.f();
t.b=1000;
System.out.println(t.b);
}
static{
Test5.a=4;
System.out.println(a);
}
public static void main(String[] args) {
// TODO 自动生成方法存根
}
static{
Test5.a=5;
System.out.println(a);
}
public void f(){
System.out.println("hhahhahah");
}
}
```
运行结果：
3
hhahhahah
1000
4
5
利用静态代码块可以对一些static变量进行赋值，最后再看一眼这些例子，都一个static的main方法，这样JVM在运行main方法的时候可以直接调用而不用创建实例。

## 5.static和final一块用表示什么
static final用来修饰成员变量和成员方法，可简单理解为“全局常量”！

对于变量，表示一旦给值就不可修改，并且通过类名可以访问。对于方法，表示不可覆盖，并且可以通过类名直接访问。

有时你希望定义一个类成员，使它的使用完全独立于该类的任何对象。通常情况下，类成员必须通过它的类的对象访问，但是可以创建这样一个成员，它能够被它自己使用，而不必引用特定的实例。在成员的声明前面加上关键字static(静态的)就能创建这样的成员。如果一个成员被声明为static，它就能够在它的类的任何对象创建之前被访问，而不必引用任何对象。你可以将方法和变量都声明为static。static 成员的最常见的例子是main( ) 。因为在程序开始执行时必须调用main() ，所以它被声明为static。

声明为static的变量实质上就是全局变量。当声明一个对象时，并不产生static变量的拷贝，而是该类所有的实例变量共用同一个static变量。声明为static的方法有以下几条限制：

它们仅能调用其他的static 方法。
它们只能访问static数据。
它们不能以任何方式引用this 或super。
如果你需要通过计算来初始化你的static变量，你可以声明一个static块，Static 块仅在该类被加载时执行一次。下面的例子显示的类有一个static方法，一些static变量，以及一个static 初始化块：

``` java
// Demonstrate static variables，methods，and blocks.
class UseStatic {
static int a = 3;
static int b;
static void meth(int x) {
System.out.println("x = " + x);
System.out.println("a = " + a);
System.out.println("b = " + b);
}
static {
System.out.println("Static block initialized.");
b = a * 4;
}
public static void main(String args[]) {
meth(42);
}
}
```
一旦UseStatic 类被装载，所有的static语句被运行。首先，a被设置为3，接着static 块执行(打印一条消息)，最后，b被初始化为a*4 或12。然后调用main()，main() 调用meth() ，把值42传递给x。3个println ( ) 语句引用两个static变量a和b，以及局部变量x 。

注意：在一个static 方法中引用任何实例变量都是非法的。下面是该程序的输出：

Static block initialized.
x = 42
a = 3
b = 12
在定义它们的类的外面，static 方法和变量能独立于任何对象而被使用。这样，你只要在类的名字后面加点号运算符即可。例如，如果你希望从类外面调用一个static方法，你可以使用下面通用的格式：

classname.method( )
这里，classname 是类的名字，在该类中定义static方法。可以看到，这种格式与通过对象引用变量调用非static方法的格式类似。一个static变量可以以同样的格式来访问——类名加点号运算符。这就是Java 如何实现全局功能和全局变量的一个控制版本。

下面是一个例子。在main() 中，static方法callme() 和static 变量b在它们的类之外被访问。

``` java
class StaticDemo {
static int a = 42;
static int b = 99;
static void callme() {
System.out.println("a = " + a);
}
}
class StaticByName {
public static void main(String args[]) {
StaticDemo.callme();
System.out.println("b = " + StaticDemo.b);
}
}
```
下面是该程序的输出：

a = 42
b = 99
static成员是不能被其所在class创建的实例访问的。

如果不加static修饰的成员是对象成员，也就是归每个对象所有的。

加static修饰的成员是类成员，就是可以由一个类直接调用，为所有对象共有的.

## 6.与非静态代码区别
静态代码块，在虚拟机加载类的时候就会加载执行，而且只执行一次；非静态代码块，在创建对象的时候（即new一个对象的时候）执行，每次创建对象都会执行一次。例如：

例：
``` java
//普通类
public class PuTong {
public PuTong(){
System.out.print("默认构造方法！-->");
}
//非静态代码块
{
System.out.print("非静态代码块！-->");
}
//静态代码块
static{
System.out.print("静态代码块！-->");
}
public static void test(){
{
System.out.println("普通方法中的代码块！");
}

    }
}
```
## 7. static语句块详解
static{}(即static块)，会在类被加载的时候执行且仅会被执行一次，一般用来初始化静态变量和调用静态方法。

``` java
public class Test
{
public static int X = 100;

    public final static int Y = 200;

    public Test()
    {
        System.out.println("Test构造函数执行");
    }
    static
    {
        System.out.println("static语句块执行");
    }

    public static void display()
    {
        System.out.println("静态方法被执行");
    }

    public void display_1()
    {
        System.out.println("实例方法被执行");
    }

}
public class StaticBlockTest
{
public static void main(String args[])
{
try
{
Class.forName("Test");
Class.forName("Test");
}
catch (ClassNotFoundException e)
{
e.printStackTrace();
}
}
}
```
结果:你会发现虽然执行了两条Class.forName("Test")语句，但是，只输出了一条"静态方法被执行"语句；其实第二条Class.forName()语句已经无效了，因为在虚拟机的生命周期中一个类只被加载一次；又因为static{}是伴随类加载执行的，所以，不管你new多少次对象实例，static{}都只执行一次。

### 7.1 static{}语句块执行的时机
static{}语句块执行的时机，即类被加载准确含义:

（1）用Class.forName()显示加载的时候;

（2）实例化一个类的时候，如将main()函数的内容改为:Test t=new Test();//这种形式其实和1相比，原理是相同的，都是显示的加载这个类，读者可以验证Test t=new Test();和Test t=(Test)Class.forName().newInstance();这两条语句效果相同。

（3）调用类的静态方法的时候，如将main()函数的内容改为:Test.display();

（4）调用类的静态变量的时候，如将main()函数的内容改为:System.out.println(Test.X);

总体来说就这四种情况，但是我们特别需要注意一下两点:

（1）调用类的静态常量的时候，是不会加载类的，即不会执行static{}语句块，读者可以自己验证一下(将main()函数的内容改为System.out.println(Test.Y);)，你会发现程序只输出了一个200；(这是java虚拟机的规定，当访问类的静态常量时，如果编译器可以计算出常量的值，则不会加载类，否则会加载类)

（2）用Class.forName()形式的时候，我们也可以自己设定要不要加载类，如

将Class.forName("Test")
改为
Class.forName("Test",false,StaticBlockTest.class.getClassLoader())
你会发现程序什么都没有输出，即Test没有被加载，static{}没有被执行。

### 7.2 static{}语句块的执行次序
（1）当一个类中有多个static{}的时候，按照static{}的定义顺序，从前往后执行；

（2）先执行完static{}语句块的内容，才会执行调用语句；

``` java
public class TestStatic
{
static
{
System.out.println(1);
}
static
{
System.out.println(2);
}
static
{
System.out.println(3);
}

    public static void main(String args[])
    {
        System.out.println(5);
    }

    static
    {
        System.out.println(4);
    }
}
```
结果:

程序会输出1，2，3，4，5
（3）如果静态变量在定义的时候就赋给了初值(如 static int X=100)，那么赋值操作也是在类加载的时候完成的，并且当一个类中既有static{}又有static变量的时候，同样遵循“先定义先执行”的原则；
``` java
class Test
{
public static int X = 300;
static
{
System.out.println(X);
X = 200;
System.out.println(X);
}
}

public class StaticBlockTest
{
public static void main(String args[])
{
System.out.println(Test.X);
}
}
```
结果:程序会依次输出300，200，200，先执行完X=300，再执行static{}语句块。

（4）访问静态常量，如果编译器可以计算出常量的值，则不会加载类。即如果A类的静态常量值是通过B类的静态常量赋值，则不加载，否则需要加载A类。
``` java
public class TestA
{
public static final int a = TestB.a;

    public static final int b = TestB.b;
public static final int c = 90;
static
{
System.out.println("TestA static语句块执行");
}
}

public class TestB
{
public static int a = 90;

    public static final int b = 90;

    static
    {
        System.out.println("TestB static语句块执行");
    }
}

public class StaticTest
{
public static void main(String args[])
{
System.out.println(TestA.a);
}
}
```
``` java
System.out.println(TestA.a);的结果：

TestB static语句块执行
TestA static语句块执行
90
System.out.println(TestA.b)和System.out.println(TestA.c)的结果：
```
1
### 7.3类加载特性 :
1）在虚拟机的生命周期中一个类只被加载一次。

2)类加载的原则：延迟加载，能少加载就少加载，因为虚拟机的空间是有限的。

3)类加载的时机： - 第一次创建对象要加载类. - 调用静态方法时要加载类,访问静态属性时会加载类。 - 加载子类时必定会先加载父类。 - 创建对象引用不加载类. - 子类调用父类的静态方法时

(1)当子类没有覆盖父类的静态方法时，只加载父类，不加载子类
(2)当子类有覆盖父类的静态方法时，既加载父类，又加载子类
访问静态常量，如果编译器可以计算出常量的值，则不会加载类,例如:public static final int a =123;否则会加载类,例如:public static final int a = math.PI
## 8. Java的初始化块、静态初始化块、构造函数的执行顺序
### 8.1 执行顺序
首先定义A, B, C三个类用作测试，其中B继承了A，C又继承了B，并分别给它们加上静态初始化块、非静态初始化块和构造函数，里面都是一句简单的输出。主类Main里面也如法炮制。 测试代码
``` java
class A {
static {
System.out.println("Static init A.");
}

    {
        System.out.println("Instance init A.");
    }

    A() {
        System.out.println("Constructor A.");
    }
}

class B extends A {
static {
System.out.println("Static init B.");
}

    {
        System.out.println("Instance init B.");
    }

    B() {
        System.out.println("Constructor B.");
    }
}

class C extends B {

    static {
        System.out.println("Static init C.");
    }

    {
        System.out.println("Instance init C.");
    }

    C() {
        System.out.println("Constructor C.");
    }
}

public class Main {

    static {
        System.out.println("Static init Main.");
    }

    {
        System.out.println("Instance init Main.");
    }

    public Main() {
        System.out.println("Constructor Main.");
    }

    public static void main(String[] args) {
        C c = new C();
        //B b = new B();
    }
}
```
当然这里不使用内部类，因为内部类不能使用静态的定义；而用静态内部类就失去了一般性。那么可以看到，当程序进入了main函数，并创建了一个类C的对象之后，输出是这样子的：
``` java
Static init Main.
Static init A.
Static init B.
Static init C.
Instance init A.
Constructor A.
Instance init B.
Constructor B.
Instance init C.
Constructor C.
```
观察上面的输出，可以观察到两个有趣的现象：

1)Main类是肯定没有被实例化过的，但是由于执行main入口函数用到了Main类，于是static初始化块也被执行了；

2)所有的静态初始化块都优先执行，其次才是非静态的初始化块和构造函数，它们的执行顺序是：

父类的静态初始化块
子类的静态初始化块
父类的初始化块
父类的构造函数
子类的初始化块
子类的构造函数
那么如果有多个实例化对象，又会不会发生变化呢？于是在第一个C类的对象后面，再实例化一个B类的对象，再观察输出：
``` java
Static init Main.
Static init A.
Static init B.
Static init C.
Instance init A.
Constructor A.
Instance init B.
Constructor B.
Instance init C.
Constructor C.
Instance init A.
Constructor A.
Instance init B.
Constructor B.
```
可以发现这输出跟前面的基本长得一样对吧？只是在后面多了4行，那是新的B类对象实例化时产生的信息，同样也是父类A的初始化块和构造函数先执行，再轮到子类B的初始化块和构造函数执行；同时还发现，静态初始化块的输出只出现了一次，也就是说每个类的静态初始化块都只在第一次实例化该类对象时执行一次。

无论如何，初始化块和构造函数总在一起执行是件有趣的事情，让我们反编译一下看看吧！

查看生成目录发现已经生成了4个.class文件，分别是A.class, B.class, C.class, Main.class，先看看Main.class的结构（这里重新注释了new B）：
``` java
1 javap -c Main

Compiled from "Main.java"
public class Main {
public Main();
Code:
0: aload_0
1: invokespecial #1                  // Method java/lang/Object."<init>":()V
4: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
7: ldc           #3                  // String Instance init Main.
9: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
12: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
15: ldc           #5                  // String Constructor Main.
17: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
20: return
```

``` java
public static void main(java.lang.String[]);
Code:
0: new           #6                  // class C
3: dup
4: invokespecial #7                  // Method C."<init>":()V
7: astore_1
8: return

static {};
Code:
0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
3: ldc           #8                  // String Static init Main.
5: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
8: return
}
```
Main.class的反编译结果
可以看到整个Main类被分成三个部分，static {}部分很显然，就是我们的static初始化块，在里面调用了println并输出了String“Static init Main.”；而main入口函数也很清晰，首先新实例化了一个类C的对象，然后调用了类C的构造函数，最后返回；而上面public Main();的部分就很有意思了，这是类Main的构造函数，但我们看到里面调用了两次println，分别输出了String“Instance init Main.”和String“Constructor Main.”。难道初始化块和构造函数被合并到一起了？

我们再看看C类的反编译结果吧：

1 javap -c C
``` java
Compiled from "Main.java"
class C extends B {
C();
Code:
0: aload_0
1: invokespecial #1                  // Method B."<init>":()V
4: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
7: ldc           #3                  // String Instance init C.
9: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
12: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
15: ldc           #5                  // String Constructor C.
17: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
20: return

static {};
Code:
0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
3: ldc           #6                  // String Static init C.
5: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
8: return
}
```
C.class的反编译结果
静态初始化块仍然单独分出一部分，输出了我们的调试语句。而另一部分，仍然还是类C的构造函数C();，可以看到它先调用了父类B的构造函数，接着输出了我们初始化块中的语句，然后才输出我们写在构造函数中的语句，最后返回。多次试验也都是如此。于是我们能够推断：初始化块的代码是被加入到子类构造函数的前面，父类初始化的后面了。

### 8.2 可能的用途：
#### 8.2.1 静态初始化块
1)用于初始化静态成员变量:

比如给类C增加一个静态成员变量sub，我们在static块里面给它赋值为5：
``` java
1 class C extends B {
2
3     static public int a;
4
5     static {
6         a = 5;
7         System.out.println("Static init C.");
8     }
9
10 ......
11
12 }
```
main函数里输出这个静态变量C.sub：

``` java
1 public static void main(String[] args) {
2     System.out.println("Value of C.sub: " + C.sub);
3 }
```
则输出结果：
``` java
Static init Main.
Static init A.
Static init B.
Static init C.
Value of C.sub: 5
```
符合类被第一次加载时执行静态初始化块的结论，且C.sub被正确赋值为5并输出了出来。

但是乍一看似乎没有什么用，因为静态成员变量在定义时就可以顺便赋值了。因此在赋值方面有点鸡肋。

#### 8.2.2 执行初始化代码
比如可以记录第一次访问类的日志，或方便单例模式的初始化等。对于单例模式，可以先用static块初始化一些可能还被其他类访问的基础参数，等到真正需要加载大量资源的时候(getInstance)再构造单体，在构造函数中加载资源。

### 8.3 非静态初始化块
基本跟构造函数一个功能，但比构造函数先执行。最常见的用法应该还是代码复用，即多个重载构造函数都有若干段相同的代码，那么可以把这些重复的代码拉出来放到初始化块中，但仍然要注意它的执行顺序，对顺序有严格要求的初始化代码就不适合使用了。

## 总结：

静态初始化块的优先级最高，也就是最先执行，并且仅在类第一次被加载时执行；
非静态初始化块和构造函数后执行，并且在每次生成对象时执行一次；
非静态初始化块的代码会在类构造函数之前执行。因此若要使用，应当养成把初始化块写在构造函数之前的习惯，便于调试；
静态初始化块既可以用于初始化静态成员变量，也可以执行初始化代码；
非静态初始化块可以针对多个重载构造函数进行代码复用。

## 参考
<https://zhuanlan.zhihu.com/p/42961231>