---
title: Kotlin入门
date: 2021-12-22 20:05:00
sidebar: 'auto'
tags:
 - kotlin基础
categories:
 - Kotlin
---

## 1. Kotlin介绍
&emsp;&emsp;Kotlin是一个用于现代多平台应用的静态编程语言，可以编译成Java字节码，也可以编译成JavaScript，方便在没有JVM的设备上运行。其由JetBrains开发并开源，其名称来自于圣彼得堡附近的科特林岛。虽然其与Java语法并不兼容，但在JVM环境中Kotlin被设计成可以和Java代码相互运作，并可以重复使用如Java集合框架等的现有Java引用的函数库。Kotlin v1.0于2016年2月15日发布。这被认为是第一个官方稳定版本，并且JetBrains已准备从该版本开始的长期向后兼容性。  
&emsp;&emsp;Google在2017年的I/O大会上宣布，Kotlin正式成为Android的一级开发语言，和Java平起平坐，Android Studio也对Kotlin进行了全面的支持。两年之后，Google又在2019年的I/O大会上宣布，Kotlin已经成为Android的第一开发语言，虽然Java仍然可以继续使用，但Google更加推荐开发者使用Kotlin来编写Android应用程序，并且未来提供的官方API也将会优先考虑Kotlin版本。

## 2. Kotlin工作原理
&emsp;&emsp;想要搞懂这个问题，我们得先来探究一下Java语言的运行机制。编程语言大致可以分为两类：编译型语言和解释型语言。编译型语言的特点是编译器会将我们编写的源代码一次性地编译成计算机可识别的二进制文件，然后计算机直接执行，像C和C++都属于编译型语言。解释型语言则完全不一样，它有一个解释器，在程序运行时，解释器会一行行地读取我们编写的源代码，然后实时地将这些源代码解释成计算机可识别的二进制数据后再执行，因此解释型语言通常效率会差一些，像Python和JavaScript都属于解释型语言。  
&emsp;&emsp;那Java是属于编译型语言还是解释型语言呢？对于这个问题，即使是做了很多年Java开发的人也可能会答错。有Java编程经验的人或许会说，Java代码肯定是要先编译再运行的，初学Java的时候都用过javac这个编译命令，因此Java属于编译型语言。如果这也是你的答案的话，那么恭喜你，答错了！虽然Java代码确实是要先编译再运行的，但是Java代码编译之后生成的并不是计算机可识别的二进制文件，而是一种特殊的class文件，这种class文件只有Java虚拟机才能识别，而这个Java虚拟机担当的其实就是解释器的角色，它会在程序运行时将编译后的class文件解释成计算机可识别的二进制数据后再执行，因此，准确来讲，Java属于解释型语言。  
![java运行原理](/img/blogs/2021/12/java-operation-principle.png "java运行原理")  
&emsp;&emsp;了解了Java语言的运行机制之后，你有没有受到一些启发呢？其实Java虚拟机并不直接和你编写的Java代码打交道，而是和编译之后生成的class文件打交道。那么如果我开发了一门新的编程语言，然后自己做了个编译器，让它将这门新语言的代码编译成同样规格的class文件，Java虚拟机能不能识别呢？没错，这其实就是Kotlin的工作原理了。Java虚拟机不关心class文件是从Java编译来的，还是从Kotlin编译来的，只要是符合规格的class文件，它都能识别。也正是这个原因，JetBrains才能以一个第三方公司的身份设计出一门可运行在JVM上的编程语言。  
&emsp;&emsp;现在你已经明白了Kotlin的工作原理，但是Kotlin究竟凭借什么魅力能够迅速得到广大开发者的支持，并且仅在1.0版本发布一年后就成为Android官方支持的开发语言呢？这就有很多原因了，比如说Kotlin的语法更加简洁，对于同样的功能，使用Kotlin开发的代码量可能会比使用Java开发的减少50% 甚至更多。另外，Kotlin的语法更加高级，相比于Java比较老旧的语法，Kotlin增加了很多现代高级语言的语法特性，使得开发效率大大提升。还有，Kotlin在语言安全性方面下了很多工夫，几乎杜绝了空指针这个全球崩溃率最高的异常等等。  
&emsp;&emsp;然而Kotlin在拥有众多出色的特性之外，还有一个最为重要的特性，那就是它和Java是100%兼容的。Kotlin可以直接调用使用Java编写的代码，也可以无缝使用Java第三方的开源库。这使得Kotlin在加入了诸多新特性的同时，还继承了Java的全部财富。

## 3. 开发工具
### 3.1 在线编辑器
&emsp;&emsp;为了方便开发者快速体验Kotlin编程，JetBrains专门提供了一个可以在线运行Kotlin代码的网站，地址是：<https://play.kotlinlang.org>，打开网站后页面如下：  
![kotlin线上编辑器](/img/blogs/2021/12/kotlin-online.png "kotlin线上编辑器")  

### 3.2 IntelliJ Idea
&emsp;&emsp;相信做Java的同学一定都用过或听过这个IDE，这是JetBrains的旗舰IDE开发工具，既然是同门，那idea当然支持kotlin语言了。可以直接在idea中创建一个kotlin项目并进行编码。  
&emsp;&emsp;下载安装idea这里就不再赘述，非常简单，大家可以自行了解。  
![idea](/img/blogs/2021/12/idea-kotlin.png "idea")  

### 3.3 其他
其他可以支持的kotlin的ide还有很多，比如开发Android的Android Studio等，这里就不再赘述，大家可以自行上网搜索。

## 4. 基础知识
从本节就开始介绍Kotlin的语法与编程相关知识了

### 4.1 变量
&emsp;&emsp;在Kotlin中定义变量的方式和Java区别很大，在Java中如果想要定义一个变量，需要在变量前面声明这个变量的类型，比如说int a表示a是一个整型变量，String b表示b是一个字符串变量。而Kotlin中定义一个变量，只允许在变量前声明两种关键字：val和var。  
1. **val（value的简写）**  
val用来声明一个不可变的变量，这种变量在初始赋值之后就再也不能重新赋值，对应Java中的final变量。
2. **var（variable的简写）**  
var用来声明一个可变的变量，这种变量在初始赋值之后仍然可以再被重新赋值，对应Java中的非final变量。

&emsp;&emsp;如果你有Java编程经验的话，可能会在这里产生疑惑，仅仅使用val或者var来声明一个变量，那么编译器怎么能知道这个变量是什么类型呢？这也是Kotlin比较有特色的一点，它拥有出色的类型推导机制。  
&emsp;&emsp;举个例子，我们打开上一节创建的LearnKotlin文件，在main()函数中编写如下代码：