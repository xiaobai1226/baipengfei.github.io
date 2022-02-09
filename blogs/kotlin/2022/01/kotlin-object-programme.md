---
title: Kotlin-面向对象编程
date: 2022-01-11 19:55:00
sidebar: 'auto'
tags:
 - kotlin基础
categories:
 - Kotlin
prev: ../../2021/12/kotlin-started
next: 
---

::: tip
本文大量借鉴或搬运了郭霖大神的《第一行代码》第三版中关于kotlin部分的内容。《第一行代码》是非常好的一本Android入门书籍，推荐大家购买学习。
:::

&emsp;&emsp;和很多现代高级语言一样，Kotlin也是面向对象的，因此理解什么是面向对象编程对我们来说就非常重要了。关于面向对象编程的解释，大家可以自行去查阅相关的资料。  
&emsp;&emsp;这里简单的来解释一下面向对象编程，不同于面向过程的语言（比如C语言），面向对象的语言是可以创建类的。类就是对事物的一种封装，比如说人、汽车、房屋、书等任何事物，我们都可以将它封装一个类，类名通常是名词。而类中又可以拥有自己的字段和函数，字段表示该类所拥有的属性，比如说人可以有姓名和年龄，汽车可以有品牌和价格，这些就属于类中的字段，字段名通常也是名词。而函数则表示该类可以有哪些行为，比如说人可以吃饭和睡觉，汽车可以驾驶和保养等，函数名通常是动词。  
&emsp;&emsp;通过这种类的封装，我们就可以在适当的时候创建该类的对象，然后调用对象中的字段和函数来满足实际编程的需求，这就是面向对象编程最基本的思想。当然，面向对象编程还有很多其他特性，如继承、多态等，但是这些特性都是建立在基本的思想之上的，理解了基本思想之后，其他的特性我们可以在后面慢慢学习。

## 1. 类与对象
### 1.1 什么是类
&emsp;&emsp;类是一种抽象的概念，其具有相同特性（数据元素）和行为（功能）的对象的抽象就是类。  
&emsp;&emsp;因此，对象的抽象是类，类的具体化就是对象，也可以说类的实例是对象，类实际上就是一种数据类型。类具有属性，它是对象的状态的抽象，用数据结构来描述类的属性。类具有操作，它是对象的行为的抽象，用操作名和实现该操作的方法来描述。  
### 1.2 什么是对象
&emsp;&emsp;对象是一种具体的概念，对象是人们要进行研究的任何事物，它不仅能表示具体的事物，还能表示抽象的规则、计划或事件。对象具有状态，一个对象用数据值来描述它的状态。对象还有操作，用于改变对象的状态，对象及其操作就是对象的行为。对象实现了数据和操作的结合，使数据和操作封装于对象的统一体中。

### 1.3 类与对象的关系
&emsp;&emsp;类与对象的关系就如模具和铸件的关系，类的实例化的结果就是对象，而对象的抽象就是类，类描述了一组有相同特性（属性）和相同行为的对象。解释的通俗一点就是，人是一种类，而具体的某一个人就是一个对象，每一个对象都符合这个类型的标准。一个类的所有对象都有相同的属性（都是人类），但有不同的属性值（名字、身高不一样等），不同的类的属性不完全相同。

### 1.4 代码说明
&emsp;&emsp;现在我们就按照刚才所学的基本思想来尝试进行面向对象编程。  
&emsp;&emsp;首先创建一个Person类。New→Kotlin File/Class，在弹出的对话框中输入“Person”，如图所示。  
![创建Person Class](/img/blogs/2022/01/person_class.png "创建Person Class")  
这里选中Class表示创建一个类，点击“OK”完成创建，会生成如下所示的代码：  
``` kotlin
class Person {

}
```
&emsp;&emsp;这是一个空的类实现，可以看到，Kotlin中也是使用class关键字来声明一个类的，这一点和Java一致。现在我们可以在这个类中加入字段和函数来丰富它的功能，这里我准备加入name和age字段，以及一个eat()函数，因为任何一个人都有名字和年龄，也都需要吃饭。
``` kotlin
class Person {
    var name = ""
    var age = 0

    fun eat() {
        println(name + " is eating. He is " + age + "years old.")
    }
}
```
&emsp;&emsp;这里使用var关键字创建了name和age这两个字段，这是因为我们需要在创建对象之后再指定具体的姓名和年龄，而如果使用val关键字的话，初始化之后就不能再重新赋值了。接下来定义了一个eat()函数，并在函数中打印了一句话，非常简单。Person类已经定义好了，接下来我们看一下如何对这个类进行实例化，代码如下所示：
``` kotlin
val p = Person()
```
&emsp;&emsp;Kotlin中实例化一个类的方式和Java是基本类似的，只是去掉了new关键字而已。之所以这么设计，是因为当你调用了某个类的构造函数时，你的意图只可能是对这个类进行实例化，因此即使没有new关键字，也能清晰表达出你的意图。Kotlin本着最简化的设计原则，将诸如new、行尾分号这种不必要的语法结构都取消了。  
&emsp;&emsp;上述代码将实例化后的类赋值到了p这个变量上面，p就可以称为Person类的一个实例，也可以称为一个对象。  
&emsp;&emsp;下面我们开始在main()函数中对p对象进行一些操作：  
``` kotlin
fun main() {
    val p = Person()
    p.name = "Jack"
    p.age = 19
    p.eat()
}
```
&emsp;&emsp;这里将p对象的姓名赋值为Jack，年龄赋值为19，然后调用它的eat()函数。运行结果如图所示：  
![Person运行结果](/img/blogs/2022/01/person_result.png "Person运行结果")  
&emsp;&emsp;这就是面向对象编程最基本的用法了，简单概括一下，就是要先将事物封装成具体的类，然后将事物所拥有的属性和能力分别定义成类中的字段和函数，接下来对类进行实例化，再根据具体的编程需求调用类中的字段和方法即可。

## 2. 继承
&emsp;&emsp;现在我们开始学习面向对象编程中另一个极其重要的特性——继承。  
### 2.1 继承的概念
&emsp;&emsp;继承也是基于现实场景总结出来的一个概念，其实非常好理解。比如现在我们要定义一个Student类，每个学生都有自己的学号和年级，因此我们可以在Student类中加入sno和grade字段。但同时学生也是人呀，学生也会有姓名和年龄，也需要吃饭，如果我们在Student类中重复定义name、age字段和eat()函数的话就显得太过冗余了。这个时候就可以让Student类去继承Person类，这样Student就自动拥有了Person中的字段和函数，另外还可以定义自己独有的字段和函数。  
&emsp;&emsp;这就是面向对象编程中继承的思想，接下来我们继续用Kotlin语言实现上述功能。新建class，命名为“Student”，并在Student类中加入学号和年级这两个字段，代码如下所示：
``` kotlin
class Student{
    var sno = ""
    var grade = 0
}
```
&emsp;&emsp;现在Student和Person这两个类之间是没有任何继承关系的，想要让Student类继承Person类，我们得做两件事才行。  
### 2.2 open关键字
&emsp;&emsp;第一件事，使Person类可以被继承。可能很多人会觉得奇怪，尤其是有Java编程经验的人。一个类本身不就是可以被继承的吗？为什么还要使Person类可以被继承呢？这就是Kotlin不同的地方， **在Kotlin中任何一个非抽象类默认都是不可以被继承的，相当于Java中给类声明了final关键字。** 之所以这么设计，其实和val关键字的原因是差不多的，因为类和变量一样，最好都是不可变的，而一个类允许被继承的话，它无法预知子类会如何实现，因此可能就会存在一些未知的风险。EffectiveJava这本书中明确提到，如果一个类不是专门为继承而设计的，那么就应该主动将它加上final声明，禁止它可以被继承。  
&emsp;&emsp;很明显，Kotlin在设计的时候遵循了这条编程规范，默认所有非抽象类都是不可以被继承的。之所以这里一直在说非抽象类，是因为抽象类本身是无法创建实例的，一定要由子类去继承它才能创建实例，因此抽象类必须可以被继承才行，要不然就没有意义了。由于Kotlin中的抽象类和Java中并无区别，这里我就不再多讲了。  
&emsp;&emsp;既然现在Person类是无法被继承的，我们得让它可以被继承才行，方法也很简单，在Person类的前面加上`open`关键字就可以了，如下所示：
``` kotlin
open class Person {
    var name = ""
    var age = 0

    fun eat() {
        println(name + " is eating. He is " + age + "years old.")
    }
}
```
&emsp;&emsp;加上open关键字之后，我们就是在主动告诉Kotlin编译器，Person这个类是专门为继承而设计的，这样Person类就允许被继承了。  
### 2.3 继承的写法
&emsp;&emsp;第二件事，要让Student类继承Person类。在Java中继承的关键字是`extends`，而在Kotlin中变成了一个冒号，写法如下：
``` kotlin
class Student : Person() {
    var sno = ""
    var grade = 0
}
```
&emsp;&emsp;继承的写法如果只是替换一下关键字倒也挺简单的，但是为什么Person类的后面要加上一对括号呢？Java中继承的时候好像并不需要括号。对于初学Kotlin的人来讲，这对括号确实挺难理解的，也可能是Kotlin在这方面设计得太复杂了，因为它还涉及主构造函数、次构造函数等方面的知识，这里我尽量尝试用最简单易懂的讲述来让你理解这对括号的意义和作用，同时顺便学习一下Kotlin中的主构造函数和次构造函数。  
## 3. 构造函数
&emsp;&emsp;任何一个面向对象的编程语言都会有构造函数的概念，Kotlin中也有，但是Kotlin将构造函数分成了两种：主构造函数和次构造函数。
### 3.1 主构造函数
&emsp;&emsp;主构造函数将会是你最常用的构造函数，每个类默认都会有一个不带参数的主构造函数，当然你也可以显式地给它指明参数。主构造函数的特点是没有函数体，直接定义在类名的后面即可。比如下面这种写法：
``` kotlin
class Student(val sno : String, val grade : Int) : Person() {
}
```
&emsp;&emsp;这里我们将学号和年级这两个字段都放到了主构造函数当中，这就表明在对Student类进行实例化的时候，必须传入构造函数中要求的所有参数。比如：
``` kotlin
val student = Student("a123", 5)
```
&emsp;&emsp;这样我们就创建了一个Student的对象，同时指定该学生的学号是a123，年级是5。另外，由于构造函数中的参数是在创建实例的时候传入的，不像之前的写法那样还得重新赋值，因此我们可以将参数全部声明成val。  
#### init结构体
&emsp;&emsp;你可能会问，主构造函数没有函数体，如果我想在主构造函数中编写一些逻辑，该怎么办呢？Kotlin给我们提供了一个init结构体，所有主构造函数中的逻辑都可以写在里面：
``` kotlin
class Student(val sno : String, val grade : Int) : Person() {
    init {
        println("sno is " + sno)
        println("grade is " + grade)
    }
}
```
&emsp;&emsp;这里我只是简单打印了一下学号和年级的值，现在如果你再去创建一个Student类的实例，一定会将构造函数中传入的值打印出来。  
&emsp;&emsp;到这里为止都还挺好理解的吧？但是这和那对括号又有什么关系呢？这就涉及了Java继承特性中的一个规定，**子类中的构造函数必须调用父类中的构造函数**，这个规定在Kotlin中也要遵守。  
&emsp;&emsp;那么回头看一下Student类，现在我们声明了一个主构造函数，根据继承特性的规定，子类的构造函数必须调用父类的构造函数，可是主构造函数并没有函数体，我们怎样去调用父类的构造函数呢？你可能会说，在init结构体中去调用不就好了。这或许是一种办法，但绝对不是一种好办法，因为在绝大多数的场景下，我们是不需要编写init结构体的。  
&emsp;&emsp;Kotlin当然没有采用这种设计，而是用了另外一种简单但是可能不太好理解的设计方式：括号。子类的主构造函数调用父类中的哪个构造函数，在继承的时候通过括号来指定。因此再来看一遍这段代码，你应该就能理解了吧。
``` kotlin
class Student(val sno : String, val grade : Int) : Person() {

}
```
&emsp;&emsp;在这里，Person类后面的一对空括号表示Student类的主构造函数在初始化的时候会调用Person类的无参数构造函数，即使在无参数的情况下，这对括号也不能省略。  
&emsp;&emsp;而如果我们将Person改造一下，将姓名和年龄都放到主构造函数当中，如下所示：
``` kotlin
open class Person(val name : String, val age : Int) {
   
    fun eat() {
        println(name + " is eating. He is " + age + "years old.")
    }
}
```
&emsp;&emsp;此时你的Student类一定会报错，这里出现错误的原因也很明显，Person类后面的空括号表示要去调用Person类中无参的构造函数，但是Person类现在已经没有无参的构造函数了，所以就提示了上述错误。  
&emsp;&emsp;如果我们想解决这个错误的话，就必须给Person类的构造函数传入name和age字段，这时就需要在Student类的主构造函数中加上name和age这两个参数，再将这两个参数传给Person类的构造函数，代码如下所示：
``` kotlin
class Student(val sno : String, val grade : Int, name : String, age : Int) : Person(name, age) {
    init {
        println("sno is " + sno)
        println("grade is " + grade)
    }
}
```
&emsp;&emsp;注意，**我们在Student类的主构造函数中增加name和age这两个字段时，不能再将它们声明成val，因为在主构造函数中声明成val或者var的参数将自动成为该类的字段，这就会导致和父类中同名的name和age字段造成冲突。** 因此，这里的name和age参数前面我们不用加任何关键字，让它的作用域仅限定在主构造函数当中即可。  
&emsp;&emsp;现在就可以通过如下代码来创建一个Student类的实例：
``` kotlin
val student = Student("a123", 5, "Jack", 19)
```
&emsp;&emsp;学到这里，我们就将Kotlin的主构造函数基本掌握了，是不是觉得继承时的这对括号问题也不是那么难以理解？但是，Kotlin在括号这个问题上的复杂度并不仅限于此，因为我们还没涉及Kotlin构造函数中的另一个组成部分——次构造函数。  
### 3.2 次构造函数
&emsp;&emsp;其实你几乎是用不到次构造函数的，Kotlin提供了一个给函数设定参数默认值的功能，基本上可以替代次构造函数的作用。但是考虑到知识结构的完整性，我决定还是介绍一下次构造函数的相关知识，顺便探讨一下括号问题在次构造函数上的区别。  
&emsp;&emsp;你要知道，任何一个类只能有一个主构造函数，但是可以有多个次构造函数。次构造函数也可以用于实例化一个类，这一点和主构造函数没有什么不同，只不过它是有函数体的。  
&emsp;&emsp;Kotlin规定，当一个类既有主构造函数又有次构造函数时，所有的次构造函数都必须调用主构造函数（包括间接调用）。这里我通过一个具体的例子就能简单阐明，代码如下：
``` kotlin
class Student(val sno : String, val grade : Int, name : String, age : Int) : Person(name, age) {
    constructor(name : String, age : Int) : this("", 0, name, age) {

    }

    constructor() : this("", 0) {

    }
}
```
#### constructor关键字
&emsp;&emsp;次构造函数是通过`constructor`关键字来定义的，这里我们定义了两个次构造函数：第一个次构造函数接收name和age参数，然后它又通过`this`关键字调用了主构造函数，并将sno和grade这两个参数赋值成初始值；第二个次构造函数不接收任何参数，它通过this关键字调用了我们刚才定义的第一个次构造函数，并将name和age参数也赋值成初始值，由于第二个次构造函数间接调用了主构造函数，因此这仍然是合法的。  
&emsp;&emsp;那么现在我们就拥有了3种方式来对Student类进行实体化，分别是通过不带参数的构造函数、通过带两个参数的构造函数和通过带4个参数的构造函数，对应代码如下所示：
``` kotlin
val student1 = Student()
val student2 = Student("Jack", 19)
val student3 = Student("a123", 5, "Jack", 19)
```
&emsp;&emsp;这样我们就将次构造函数的用法掌握得差不多了，但是到目前为止，继承时的括号问题还没有进一步延伸，暂时和之前学过的场景是一样的。  
&emsp;&emsp;那么接下来我们就再来看一种非常特殊的情况：类中只有次构造函数，没有主构造函数。这种情况真的十分少见，但在Kotlin中是允许的。当一个类没有显式地定义主构造函数且定义了次构造函数时，它就是没有主构造函数的。我们结合代码来看一下：
``` kotlin
class Student : Person {
    constructor(name : String, age : Int) : super("", 0, name, age) {

    }
}
```
&emsp;&emsp;注意这里的代码变化，首先Student类的后面没有显式地定义主构造函数，同时又因为定义了次构造函数，所以现在Student类是没有主构造函数的。那么既然没有主构造函数，继承Person类的时候也就不需要再加上括号了。其实原因就是这么简单，只是很多人在刚开始学习Kotlin的时候没能理解这对括号的意义和规则，因此总感觉继承的写法有时候要加上括号，有时候又不要加，搞得晕头转向的，而在你真正理解了规则之后，就会发现其实还是很好懂的。  
&emsp;&emsp;另外，由于没有主构造函数，次构造函数只能直接调用父类的构造函数，上述代码也是将`this`关键字换成了`super`关键字，这部分就很好理解了，因为和Java比较像，我也就不再多说了。

## 4. 接口
&emsp;&emsp;Kotlin中的接口部分和Java几乎是完全一致的。  
&emsp;&emsp;接口是用于实现多态编程的重要组成部分。我们都知道，Java是单继承结构的语言，任何一个类最多只能继承一个父类，但是却可以实现任意多个接口，Kotlin也是如此。  
### 4.1 接口使用与多态
&emsp;&emsp;我们可以在接口中定义一系列的抽象行为，然后由具体的类去实现。下面还是通过具体的代码来学习一下，首先创建一个Study接口，并在其中定义几个学习行为，创建类型选择`Interface`。  
&emsp;&emsp;然后在Study接口中添加几个学习相关的函数，注意接口中的函数不要求有函数体，代码如下所示：
``` kotlin
interface Study {
    fun readBooks()
    fun doHomework()
}
```
&emsp;&emsp;接下来就可以让Student类去实现Study接口了，这里我将Student类原有的代码调整了一下，以突出继承父类和实现接口的区别：
``` kotlin
class Student(name : String, age : Int) : Person(name, age), Study {
    override fun readBooks() {
        println(name + " is reading.")
    }

    override fun doHomework() {
        println(name + " is doing homework.")
    }
}
```
&emsp;&emsp;熟悉Java的人一定知道，Java中继承使用的关键字是`extends`，实现接口使用的关键字是`implements`，而Kotlin中统一使用冒号，中间用逗号进行分隔。上述代码就表示Student类继承了Person类，同时还实现了Study接口。另外接口的后面不用加上括号，因为它没有构造函数可以去调用。  
&emsp;&emsp;Study接口中定义了readBooks()和doHomework()这两个待实现函数，因此Student类必须实现这两个函数。Kotlin中使用`override`关键字来重写父类或者实现接口中的函数，这里我们只是简单地在实现的函数中打印了一行日志。  
&emsp;&emsp;现在我们可以在main()函数中编写如下代码来调用这两个接口中的函数：
``` kotlin
fun main() {
    val student = Student("Jack", 19)
    doStudy(student)
}

fun doStudy(study: Study) {
    study.readBooks()
    study.doHomework()
}
```
&emsp;&emsp;这里为了演示一下多态编程的特性，我故意将代码写得复杂了一点。首先创建了一个Student类的实例，本来是可以直接调用该实例的readBooks()和doHomework()函数的，但是我没有这么做，而是将它传入到了doStudy()函数中。doStudy()函数接收一个Study类型的参数，由于Student类实现了Study接口，因此Student类的实例是可以传递给doStudy()函数的，接下来我们调用了Study接口的readBooks()和doHomework()函数，**这种就叫作面向接口编程，也可以称为多态**。  
&emsp;&emsp;这样我们就将Kotlin中接口的用法基本学完了。  
### 4.2 接口的默认实现
&emsp;&emsp;为了让接口的功能更加灵活，Kotlin还增加了一个额外的功能：允许对接口中定义的函数进行默认实现。其实Java在JDK 1.8之后也开始支持这个功能了，因此总体来说，Kotlin和Java在接口方面的功能仍然是一模一样的。  
&emsp;&emsp;下面我们学习一下如何对接口中的函数进行默认实现，修改Study接口中的代码，如下所示：
``` kotlin
interface Study {
    fun readBooks()

    fun doHomework() {
        println("do homework default implementation.")
    }
}
```
&emsp;&emsp;可以看到，我们给doHomework()函数加上了函数体，并且在里面打印了一行日志。如果接口中的一个函数拥有了函数体，这个函数体中的内容就是它的默认实现。现在当一个类去实现Study接口时，只会强制要求实现readBooks()函数，而doHomework()函数则可以自由选择实现或者不实现，不实现时就会自动使用默认的实现逻辑。  
&emsp;&emsp;现在回到Student类当中，你会发现如果我们删除了doHomework()函数，代码是不会提示错误的，而删除readBooks()函数则不行。

## 5. 可见性修饰符
&emsp;&emsp;熟悉Java的人一定知道，Java中有public、private、protected和default（默认）这4种函数可见性修饰符。Kotlin中也有4种，分别是public、private、protected和internal，需要使用哪种修饰符时，直接定义在fun关键字的前面即可。下面我详细介绍一下Java和Kotlin中这些函数可见性修饰符的异同。  
* private修饰符  
&emsp;&emsp;首先private修饰符在两种语言中的作用是一模一样的，都表示只对当前类内部可见。
* public修饰符  
&emsp;&emsp;public修饰符的作用虽然也是一致的，表示对所有类都可见，但是在Kotlin中public修饰符是默认项，而在Java中default才是默认项。前面我们定义了那么多的函数，都没有加任何的修饰符，所以它们默认都是public的。
* protected修饰符  
&emsp;&emsp;protected关键字在Java中表示对当前类、子类和同一包路径下的类可见，在Kotlin中则表示只对当前类和子类可见。
* internal修饰符  
&emsp;&emsp;Kotlin抛弃了Java中的default可见性（同一包路径下的类可见），引入了一种新的可见性概念，只对同一模块中的类可见，使用的是internal修饰符。比如我们开发了一个模块给别人使用，但是有一些函数只允许在模块内部调用，不想暴露给外部，就可以将这些函数声明成internal。  

下表更直观地对比了Java和Kotlin中函数可见性修饰符之间的区别。
|修饰符|Java|Kotlin|
|-|-|-|
|public|所有类可见|所有类可见（默认）|
|private|当前类可见|当前类可见|
|protected|当前类、子类、同一包路径下的类可见|当前类、子类可见|
|default|同一包路径下的类可见（默认）|无|
|internal|无|同一模块中的类可见|

## 6. 数据类 data关键字
&emsp;&emsp;在一个规范的系统架构中，数据类通常占据着非常重要的角色，它们用于将服务器端或数据库中的数据映射到内存中，为编程逻辑提供数据模型的支持。或许你听说过MVC、MVP、MVVM之类的架构模式，不管是哪一种架构模式，其中的M指的就是数据类。  
&emsp;&emsp;数据类通常需要重写equals()、hashCode()、toString()这几个方法。其中，equals()方法用于判断两个数据类是否相等。hashCode()方法作为equals()的配套方法，也需要一起重写，否则会导致HashMap、HashSet等hash相关的系统类无法正常工作。toString()方法用于提供更清晰的输入日志，否则一个数据类默认打印出来的就是一行内存地址。  
&emsp;&emsp;这里我们新建一个手机数据类，字段就简单一点，只有品牌和价格这两个字段。如果使用Java来实现这样一个数据类，代码就需要这样写：
``` java
public class Cellphone {
    String brand;
    double price;

    public Cellphone(String brand, double price) {
        this.brand = brand;
        this.price = price;
    }

    @Override
    public boolean equals(Object obj) {
        if(obj instanceof Cellphone) {
            Cellphone other = (Cellphone) obj;
            return other.brand.equals(brand) && other.price == price;
        }

        return false;
    }

    @Override
    public int hashCode() {
        return brand.hashCode() + (int) price;
    }

    @Override
    public String toString() {
        return "Cellphone(brand=" + brand + ", price=" + price + ")";
    }
}
```
&emsp;&emsp;看上去挺复杂的吧？关键是这些代码还是一些没有实际逻辑意义的代码，只是为了让它拥有数据类的功能而已。而同样的功能使用Kotlin来实现就会变得极其简单，新建class，在弹出的对话框中输入“Cellphone”，创建类型选择“Data Class”（如果没有，则选择Class，创建成功后自己添加data关键字即可），然后在创建的类中编写如下代码：
``` kotlin
data class Cellphone(val brand: String, val price: Double)
```
&emsp;&emsp;你没看错，只需要一行代码就可以实现了！神奇的地方就在于`data`这个关键字，当在一个类前面声明了`data`关键字时，就表明你希望这个类是一个数据类，Kotlin会根据主构造函数中的参数帮你将equals()、hashCode()、toString()等固定且无实际逻辑意义的方法自动生成，从而大大减少了开发的工作量。  
&emsp;&emsp;另外，当一个类中没有任何代码时，还可以将尾部的大括号省略。  
&emsp;&emsp;下面我们来测试一下这个数据类，在main()函数中编写如下代码：
``` kotlin
fun main () { 
    val cellphone1 = Cellphone("Samsung", 1299.99)
    val cellphone2 = Cellphone("Samsung", 1299.99)
    println(cellphone1) 
    println("cellphone1 equals cellphone2" + (cellphone1 == cellphone2))
}
```
&emsp;&emsp;这里我们创建了两个Cellphone对象，首先直接将第一个对象打印出来，然后判断这两个对象是否相等。运行一下程序，结果如图所示  
![Cellphone运行结果](/img/blogs/2022/01/data_result.png "Cellphone运行结果")    
&emsp;&emsp;很明显，Cellphone数据类已经正常工作了。而如果Cellphone类前面没有data这个关键字，得到的会是截然不同的结果。如果感兴趣的话，你可以自己动手尝试一下。

## 7. 单例类 object关键字
&emsp;&emsp;掌握了数据类的使用技巧之后，接下来我们再来看另外一个Kotlin中特有的功能——单例类。  
&emsp;&emsp;想必你一定听说过[单例模式](../../../design-patterns/2018/03/singleton.md "单例模式")吧，这是最常用、最基础的设计模式之一，它可以用于避免创建重复的对象。比如我们希望某个类在全局最多只能拥有一个实例，这时就可以使用单例模式。当然单例模式也有很多种写法，这里就演示一种最常见的Java写法吧：
``` java
public class Singleton {
    private static Singleton instance;

    private Singleton() {}

    public synchronized static Singleton getInstance() {
        if (instance = null) {
            instance = new Singleton();
        }
        return instance; 
    }

    public void singletonTest() {
        System.out.println("singletonTest is called.");
    }
```
&emsp;&emsp;这段代码其实很好理解，首先为了禁止外部创建Singleton的实例，我们需要用private关键字将Singleton的构造函数私有化，然后给外部提供了一个getInstance()静态方法用于获取Singleton的实例。在getInstance()方法中，我们判断如果当前缓存的Singleton实例为null，就创建一个新的实例，否则直接返回缓存的实例即可，这就是单例模式的工作机制。  
&emsp;&emsp;而如果我们想调用单例类中的方法，也很简单，比如想调用上述的singletonTest()方法，就可以这样写：
``` java
Singleton singleton = Singleton.getInstance();
singleton.singletonTest();
```
&emsp;&emsp;虽然Java中的单例实现并不复杂，但是Kotlin明显做得更好，它同样是将一些固定的、重复的逻辑实现隐藏了起来，只暴露给我们最简单方便的用法。  
&emsp;&emsp;在Kotlin中创建一个单例类的方式极其简单，只需要在class关键字前添加`object`关键字即可。现在我们尝试创建一个Kotlin版的Singleton单例类，新建class，在弹出的对话框中输入“Singleton”，创建类型选择“Object”（如果没有，则选择Class，创建成功后自己修改为object关键字即可），点击“OK”完成创建，初始代码如下所示：
``` kotlin
object Singleton {
}
```
&emsp;&emsp;现在Singleton就已经是一个单例类了，我们可以直接在这个类中编写需要的函数，比如加入一个singletonTest()函数：
``` kotlin
object Singleton {
    fun singletonTest() {
        println("singletonTest is called.")
    }
}
```
&emsp;&emsp;可以看到，在Kotlin中我们不需要私有化构造函数，也不需要提供getInstance()这样的静态方法，只需要把class关键字改成object关键字，一个单例类就创建完成了。而调用单例类中的函数也很简单，比较类似于Java中静态方法的调用方式：
``` kotlin
Singleton.singletonTest()
```
&emsp;&emsp;这种写法虽然看上去像是静态方法的调用，但其实Kotlin在背后自动帮我们创建了一个Singleton类的实例，并且保证全局只会存在一个Singleton实例。