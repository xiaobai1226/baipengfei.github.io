---
title: Kotlin入门
date: 2021-12-22 20:05:00
sidebar: 'auto'
tags:
 - kotlin基础
categories:
 - Kotlin
next: ../../2022/01/kotlin-object-programme
---

::: tip
本文大量借鉴或搬运了郭霖大神的《第一行代码》第三版中关于kotlin部分的内容。《第一行代码》是非常好的一本Android入门书籍，推荐大家购买学习。
:::

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

&emsp;&emsp;如果你有Java编程经验的话，可能会在这里产生疑惑，仅仅使用val或者var来声明一个变量，那么编译器怎么能知道这个变量是什么类型呢？这也是Kotlin比较有特色的一点，它拥有出色的**类型推导机制**。  
&emsp;&emsp;举个例子，我们打开上一节创建的LearnKotlin文件，在main()函数中编写如下代码：
``` kotlin
fun main() {
    val a = 5
    println("a = " + a)
}
```
::: tip
Kotlin每行结尾不需要像Java一样加分号
:::
&emsp;&emsp;在上述代码中，我们使用val关键字定义了一个变量a，并将它赋值为5，这里a就会被自动推导成整型变量。因为既然你要把一个整数赋值给a，那么a就只能是整型变量，而如果你要把一个字符串赋值给a的话，那么a就会被自动推导成字符串变量，这就是Kotlin的类型推导机制。

现在我们运行一下main()函数，执行结果如图所示：  
![运行](/img/blogs/2021/12/run_main.png "运行")  

&emsp;&emsp;但是Kotlin的类型推导机制并不一定能正常工作，比如说如果我们对一个变量延迟赋值的话，Kotlin就无法自动推导它的类型了。这时候就需要显式地声明变量类型才行，Kotlin同样支持显示声明变量类型，语法如下所示：
``` kotlin
val a: Int = 5
```

&emsp;&emsp;可以看到，我们显式地声明了变量a为Int类型，此时Kotlin就不会再尝试进行类型推导了。如果现在你尝试将一个字符串赋值给a，那么编译器就会抛出类型不匹配的异常。  
&emsp;&emsp;对比代码可以看到Kotlin中Int的首字母是大写的，而Java中int的首字母是小写的。这是因为Kotlin完全抛弃了Java中的基本数据类型，全部使用了对象数据类型。这意味着在Java中int是关键字，而在Kotlin中Int变成了一个类，它拥有自己的方法和继承结构。  

表2.1中列出了Java中的每一个基本数据类型在Kotlin中对应的对象数据类型
|Java基本数据类型|Kotlin对象数据类型|说明|
|:-:|:-:|:-:|
|int|Int|整形|
|long|Long|长整型|
|short|Short|短整型|
|float|Float|单精度浮点型|
|double|Double|双精度浮点型|
|boolean|Boolean|布尔型|
|char|Char|字符型|
|byte|Byte|字节型|

&emsp;&emsp;上面的内容讲完后，回到val与var，这里大家可能会产生疑惑：为什么要同时存在这两个关键字，干脆全部用var关键字不就好了。其实Kotlin之所以这样设计，是为了解决Java中final关键字没有被合理使用的问题。  
&emsp;&emsp;在Java中，除非你主动在变量前声明了final关键字，否则这个变量就是可变的。然而这并不是一件好事，当项目变得越来越复杂，参与开发的人越来越多时，你永远不知道一个可变的变量会在什么时候被谁给修改了，即使它原本不应该被修改，这就经常会导致出现一些很难排查的问题。因此，一个好的编程习惯是，除非一个变量明确允许被修改，否则都应该给它加上final关键字。  
&emsp;&emsp;但是，不是每个人都能养成这种良好的编程习惯。我相信至少有90%的Java程序员没有主动在变量前加上final关键字的意识，仅仅因为Java对此是不强制的。因此，Kotlin在设计的时候就采用了和Java完全不同的方式，提供了val和var这两个关键字，必须由开发者主动声明该变量是可变的还是不可变的。  
&emsp;&emsp;那么我们应该什么时候使用val，什么时候使用var呢？这里我告诉你一个小诀窍，就是永远优先使用val来声明一个变量，而当val没有办法满足你的需求时再使用var。这样设计出来的程序会更加健壮，也更加符合高质量的编码规范。

### 4.2 函数
&emsp;&emsp;不少刚接触编程的人对于函数和方法这两个概念有些混淆，不明白它们有什么区别。其实，函数和方法就是同一个概念，这两种叫法都是从英文翻译过来的，函数翻译自function，方法翻译自method，它们并没有什么区别，只是不同语言的叫法习惯不一样而已。而Java中方法的叫法更普遍一些，Kotlin中函数的叫法更普遍一些，你只要知道它们是同一种东西就可以了，不用在这个地方产生疑惑。  
&emsp;&emsp;函数是用来运行代码的载体，你可以在一个函数里编写很多行代码，当运行这个函数时，函数中的所有代码会全部运行。像我们前面使用过的main()函数就是一个函数，只不过它比较特殊，是程序的入口函数，即程序一旦运行，就是从main()函数开始执行的。但是只有一个main()函数的程序显然是很初级的，和其他编程语言一样，Kotlin也允许我们自由地定义函数，语法规则如下：
``` kotlin
fun methodName(param1: Int, param2: Int): Int { 
    return 0
}
```
下面我来解释一下上述的语法规则：
1. fun（function的简写）是定义函数的关键字，无论你定义什么函数，都一定要使用fun来声明。
2. 紧跟在fun后面的是函数名，这个就没有什么要求了，你可以根据自己的喜好起任何名字，但是良好的编程习惯是函数名最好要有一定的意义，能表达这个函数的作用是什么。
3. 函数名后面紧跟着一对括号，里面可以声明该函数接收什么参数，参数的数量可以是任意多个，例如上述示例就表示该函数接收两个Int类型的参数。参数的声明格式是“参数名: 参数类型”，其中参数名也是可以随便定义的，这一点和函数名类似。如果不想接收任何参数，那么写一对空括号就可以了。
4. 参数括号后面的那部分是可选的，用于声明该函数会返回什么类型的数据，上述示例就表示该函数会返回一个Int类型的数据。如果你的函数不需要返回任何数据，这部分可以直接不写。  
5. 最后花括号之间的内容就是函数体了，我们可以在这里编写一个函数的具体逻辑。由于上述示例中声明了该函数会返回一个Int类型的数据，因此在函数体中我们简单地返回了一个0。  

&emsp;&emsp;这就是定义一个函数最标准的方式了，虽然Kotlin中还有许多其他修饰函数的关键字，但是只要掌握了上述函数定义规则，你就已经能应对80%以上的编程场景了，至于其他的关键字，我们会在后面慢慢学习。接下来我们尝试按照上述定义函数的语法规则来定义一个有意义的函数，如下所示：
``` kotlin
fun largerNumber(num1: Int, num2: Int): Int {
    return max(num1, num2)
}
```
&emsp;&emsp;这里定义了一个名叫largerNumber()的函数，该函数的作用很简单，接收两个整型参数，然后总是返回两个参数中更大的那个数。注意，上述代码中使用了一个max()函数，这是Kotlin提供的一个内置函数，它的作用就是返回两个参数中更大的那个数，因此我们的largerNumber()函数其实就是对max()函数做了一层封装而已。

``` kotlin
fun main() {
    val a = 30
    val b = 50
    val value = largerNumber(a, b)
    println("larger number is " + value)
}

fun largerNumber(num1: Int, num2: Int): Int {
    return max(num1, num2)
}
```
&emsp;&emsp;这段代码很简单，我们定义了a、b两个变量，a的值是37，b的值是40，然后调用largerNumber()函数，并将a、b作为参数传入。largerNumber()函数会返回这两个变量中较大的那个数，最后将返回值打印出来。  

现在运行一下代码，结果如图所示。程序正如我们预期的那样运行了
![结果](/img/blogs/2021/12/larger-number-result.png "结果")

&emsp;&emsp;这就是Kotlin中最基本也是最常用的函数用法，虽然这里我们实现的largerNumber()函数很简单，但是掌握了函数的定义规则之后，你想实现多么复杂的函数都是可以的。  

&emsp;&emsp;在前面的基础上，我们再来学习一个Kotlin函数的语法糖，这个语法糖在以后的开发中会起到相当重要的作用。当一个函数中只有一行代码时，Kotlin允许我们不必编写函数体，可以直接将唯一的一行代码写在函数定义的尾部，中间用等号连接即可。比如我们刚才编写的largerNumber()函数就只有一行代码，于是可以将代码简化成如下形式：
``` kotlin
fun largerNumber(num1: Int, num2: Int): Int = max(num1, num2)
```
&emsp;&emsp;使用这种语法，return关键字也可以省略了，等号足以表达返回值的意思。另外，还记得Kotlin出色的类型推导机制吗，在这里它也可以发挥重要的作用。由于max()函数返回的是一个Int值，而我们在largerNumber()函数的尾部又使用等号连接了max()函数，因此Kotlin可以推导出largerNumber()函数返回的必然也是一个Int值，这样就不用再显式地声明返回值类型了，代码可以进一步简化成如下形式：
``` kotlin
fun largerNumber(num1: Int, num2: Int) = max(num1, num2)
```
&emsp;&emsp;可能你会觉得，函数只有一行代码的情况并不多嘛，这个语法糖也不会很常用吧？其实并不是这样的，因为它还可以结合Kotlin的其他语言特性一起使用，对简化代码方面的帮助很大，后面我们会慢慢学习它更多的使用场景。

### 4.3 条件语句
&emsp;&emsp;Kotlin中的条件语句主要有两种实现方式：if和when。
#### 4.3.1 if语句
&emsp;&emsp;Kotlin中的if语句和Java中的if语句几乎没有任何区别，咱们先来讲下if的基础用法。  
``` kotlin
fun largerNumber (num1: Int, num2: Int): Int {
    var value = 0
    if (num1 > num2) {
        value =  num1
    } else if (num1 < num2) {
        value = num2
    } else {
        value = -1
    }
    return value
}
```
再来解释一下上述if语句的语法规则：
1. if  
   是关键字，只要使用if就必须以这个关键字开头
2. ()  
   括号中是条件，只要内容为Boolean类型即可
3. {}  
   花括号中为条件命中时要执行的内容，如果只有一行，花括号可省略
4. else if  
   如果同时多有个Boolean条件，一个if就无法满足需求了，这时可以在第一个完整的if语句后追加else if，后面规则一致。else if可以不存在也可以写多个，计算机会按照编码时自上而下的顺序，依次进行判断，且无论是if还是else if只要第一次命中后，就会直接跳出整个if语句，不会执行后续的内容。
5. else  
   else含义为其他，应写在if语句的最后，若上述的if和else if全部未命中则将会执行else后花括号中的内容，且else非必填。  

&emsp;&emsp;到目前为止，Kotlin中的if用法和Java中是完全一样的。但它们还是存在不同之处的，接下来我们就着重看一下不同的地方。  
&emsp;&emsp;Kotlin中的if语句相比于Java有一个额外的功能，它是可以有**返回值**的，**返回值就是if语句每一个条件中最后一行代码的返回值**。因此，上述代码就可以简化成如下形式：
``` kotlin
fun largerNumber (num1: Int, num2: Int): Int {
    val value = if (num1 > num2) {
        num1
    } else if (num1 < num2) {
        num2
    } else {
        -1
    }

    return value
}
```
&emsp;&emsp;注意这里的代码变化，if语句使用每个条件的最后一行代码作为返回值，并将返回值赋值给了value变量。由于现在没有重新赋值的情况了，因此可以使用val关键字来声明value变量，最终将value变量返回。  
&emsp;&emsp;仔细观察上述代码，你会发现value其实也是一个多余的变量，我们可以直接将if语句返回，这样代码将会变得更加精简
``` kotlin
fun largerNumber (num1: Int, num2: Int): Int {
    return if (num1 > num2) {
        num1
    } else if (num1 < num2) {
        num2
    } else {
        -1
    }
}
```
&emsp;&emsp;到这里为止，你觉得代码足够精简了吗？确实还不错，但是我们还可以做得更好。回顾函数部分学过的语法糖，当一个函数只有一行代码时，可以省略函数体部分，直接将这一行代码使用等号串连在函数定义的尾部。虽然上述代码中的largerNumber()函数不止只有一行代码，但是它和只有一行代码的作用是相同的，只是返回了一下if语句的返回值而已，符合该语法糖的使用条件。那么我们就可以将代码进一步精简：
``` kotlin
fun largerNumber (num1: Int, num2: Int) = if (num1 > num2) {
        num1
    } else if (num1 < num2) {
        num2
    } else {
        -1
    }
```
&emsp;&emsp;上面还提过if语句如果只有一行要执行的内容可以省略{}，所以还可以将上述代码再精简一下，直接压缩成一行代码：
``` kotlin
fun largerNumber (num1: Int, num2: Int) = if (num1 > num2) num1 else if (num1 < num2) num2 else -1
```
#### 4.3.2 when语句
&emsp;&emsp;Kotlin中的when语句有点类似于Java中的switch语句，但它又远比switch语句强大得多。  
&emsp;&emsp;如果你熟悉Java的话，应该知道Java中的switch语句并不怎么好用。首先，switch只能传入整型或短于整型的变量作为条件，JDK 1.7之后增加了对字符串变量的支持，但如果你的判断逻辑使用的并非是上述几种类型的变量，那switch并不适合使用。其次，switch中的每个case条件都要在最后主动加上一个break，否则执行完当前case之后会依次执行下面的case，由于忘加break曾经导致过无数奇怪的bug。**（本人亲身踩过坑，坑死我了！！！当然也怪自己不仔细）**  
&emsp;&emsp;而Kotlin中的when语句不仅解决了上述痛点，还增加了许多更为强大的新特性，有时候它比if语句还要简单好用，下面就来介绍一下。  
&emsp;&emsp;when语句允许传入一个任意类型的参数，然后可以在when的结构体中定义一系列的条件，格式是：
``` kotlin
when(条件) {
    // 精确匹配
    匹配值 -> {执行逻辑}
    // 类型匹配
    is 类型 -> {执行逻辑}
    // 未匹配到时执行逻辑
    else -> {执行逻辑}
}
```

下面通过例子来加深理解
``` kotlin
fun getScore(name: String) = if (name == "Tom") {
    86
} else if (name == "Jim") {
    77
} else if (name == "Jack") {
    95
} else if (name == "Lily") {
    100
} else {
    0
}
```
&emsp;&emsp;这里定义了一个getScore()函数，这个函数接收一个学生姓名参数，然后通过if判断找到该学生对应的考试分数并返回。  
&emsp;&emsp;虽然上述代码确实可以实现我们想要的功能，但是写了这么多的if和else，代码非常冗余。所以当你的判断条件非常多的时候，就可以考虑使用when语句，现在我们将代码改成如下写法：
``` kotlin
fun getScore(name: String) = when(name) {
    "Tom" -> 86
    "Jim" -> 77
    "Jack" -> 95
    "Lily" -> 100
    else -> 0
}
```
&emsp;&emsp;可以看到，代码瞬间清爽了很多。另外，when语句和if语句一样，也是可以有返回值的，因此我们仍然可以使用单行代码函数的语法糖。  
&emsp;&emsp;当你的执行逻辑只有一行代码时，{ }可以省略。这样再来看上述代码就很好理解了吧。除了精确匹配之外，when语句还允许进行类型匹配。什么是类型匹配呢？这里我再举个例子。定义一个checkNumber()函数，如下所示：
``` kotlin
fun checkNumber(num: Number) {
    when(num) {
        is Int -> println("number is Int")
        is Double -> println("number is Double")
        else -> println("number not support")
    }
}
```
&emsp;&emsp;上述代码中，is关键字就是类型匹配的核心，它相当于Java中的instanceof关键字。由于checkNumber()函数接收一个Number类型的参数，这是Kotlin内置的一个抽象类，像Int、Long、Float、Double等与数字相关的类都是它的子类，所以这里就可以使用类型匹配来判断传入的参数到底属于什么类型，如果是Int型或Double型，就将该类型打印出来，否则就打印不支持该参数的类型。  

&emsp;&emsp;when语句的基本用法就是这些，但其实when语句还有一种不带参数的用法，虽然这种用法可能不太常用，但有的时候却能发挥很强的扩展性。拿刚才的getScore()函数举例，如果我们不在when语句中传入参数的话，还可以这么写：
``` kotlin
fun getScore(name: String) = when {
    name == "Tom" -> 86
    name == "Jim" -> 77
    name == "Jack" -> 95
    name == "Lily" -> 100
    else -> 0
}
```
&emsp;&emsp;可以看到，这种用法是将判断的表达式完整地写在when的结构体当中。  
&emsp;&emsp;注意，**Kotlin中判断字符串或对象是否相等可以直接使用==关键字**，而不用像Java那样调用equals()方法。可能你会觉得这种无参数的when语句写起来比较冗余，但有些场景必须使用这种写法才能实现。  
&emsp;&emsp;举个例子，假设所有名字以Tom开头的人，他的分数都是86分，这种场景如果用带参数的when语句来写就无法实现，而使用不带参数的when语句就可以这样写：
``` kotlin
fun getScore(name: String) = when {
    name.startsWith("Tom") -> 86
    name == "Jim" -> 77
    name == "Jack" -> 95
    name == "Lily" -> 100
    else -> 0
}
```
&emsp;&emsp;现在不管你传入的名字是Tom还是Tommy，只要是以Tom开头的名字，他的分数就是86分。

### 4.4 循环语句
&emsp;&emsp;学习完了条件语句之后，接下来我们开始学习Kotlin中的循环语句。熟悉Java的人应该都知道，Java中主要有两种循环语句：while循环和for循环。而Kotlin也提供了while循环和for循环。
#### 4.4.1 for循环
下面我们开始学习Kotlin中的for循环。Kotlin在for循环方面做了很大幅度的修改，Java中最常用的for-i循环在Kotlin中直接被舍弃了，而Java中另一种for-each循环则被Kotlin进行了大幅度的加强，变成了for-in循环，所以我们只需要学习for-in循环的用法就可以了。在开始学习for-in循环之前，还得先向你普及一个区间的概念，因为这也是Java中没有的东西。  
**1. 闭区间**  
我们可以使用如下Kotlin代码来表示一个闭区间：
``` kotlin
val range = 0..10
```
&emsp;&emsp;上述代码表示创建了一个0到10的区间，并且两端都是闭区间，这意味着0到10这两个端点都是包含在区间中的，用数学的方式表达出来就是[0, 10]。其中，..是创建两端闭区间的关键字，在..的两边指定区间的左右端点就可以创建一个区间了。有了区间之后，我们就可以通过for-in循环来遍历这个区间，比如在main()函数中编写如下代码：
``` kotlin
fun main() {
    for(i in 0..10) {
        println(i)
    }
}
```
这就是for-in循环最简单的用法了，我们遍历了区间中的每一个元素，并将它打印出来。  

**2. 左闭右开区间**  
&emsp;&emsp;但是在很多情况下，双端闭区间却不如单端闭区间好用。比如数组的下标都是从0开始的，一个长度为10的数组，它的下标区间范围是0到9，因此左闭右开的区间在程序设计当中更加常用。Kotlin中可以使用until关键字来创建一个左闭右开的区间，如下所示：
``` kotlin
val range = 0 until 10
```
&emsp;&emsp;上述代码表示创建了一个0到10的左闭右开区间，它的数学表达方式是[0, 10)。修改main()函数中的代码，使用until替代..关键字，你就会发现最后一行10不会再打印出来了。  

**3. step关键字**  
&emsp;&emsp;默认情况下，for-in循环每次执行循环时会在区间范围内递增1，相当于Java for-i循环中i++的效果，而如果你想跳过其中的一些元素，可以使用step关键字：
``` kotlin
fun main() {
    for(i in 0 until 10 step 2) {
        println(i)
    }
}
```
&emsp;&emsp;上述代码表示在遍历[0, 10)这个区间的时候，每次执行循环都会在区间范围内递增2，相当于for-i循环中i = i + 2的效果。  
&emsp;&emsp;可以看到，现在区间中所有奇数的元素都被跳过了。结合step关键字，我们就能够实现一些更加复杂的循环逻辑。

**4. 降序**  
&emsp;&emsp;前面我们所学习的..和until关键字都要求区间的左端必须小于等于区间的右端，也就是这两种关键字创建的都是一个升序的区间。如果你想创建一个降序的区间，可以使用`downTo`关键字，用法如下：
``` kotlin
fun main() {
    for(i in 10 downTo 1) {
        println(i)
    }
}
```
&emsp;&emsp;这里我们创建了一个[10, 1]的降序区间。降序区间同样可以结合step关键字跳过区间中的一些元素。  

**5. 遍历集合**  
&emsp;&emsp;for-in循环除了可以对区间进行遍历之外，还可以用于遍历数组和集合。  
。。。待补充

#### 4.4.2 while循环
while循环不管是在语法还是使用技巧上都和Java中的while循环没有任何区别。  
。。。待补充