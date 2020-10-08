---
title: 设计模式-----19、迭代模式
date: 2018-03-23 10:50:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./cor
next: ./template-method
---

**概念：**  
&emsp;&emsp;Iterator模式也叫迭代模式，是行为模式之一，它把对容器中包含的内部对象的访问委让给外部类，使用Iterator（遍历）按顺序进行遍历访问的设计模式。  
&emsp;&emsp;迭代模式使用比较少，JDK集合也提供了Iterator的具体实现，可以直接拿来用，不必自己实现  
&emsp;&emsp;在应用Iterator模式之前，首先应该明白Iterator模式用来解决什么问题。或者说，如果不使用Iterator模式，会存在什么问题。  
1. 由容器自己实现顺序遍历。直接在容器类里直接添加顺序遍历方法
2. 让调用者自己实现遍历。直接暴露数据细节给外部  

我们用代码实现一下  
首先，新建一个Book类，这是容器中的内容

``` java
public class Book {
    private String id;
    private String name;
    private double price;
    
    public Book(String id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
    
    public void display() {
        System.out.println("ID=" + id + ",\tname=" + name + ",\tprice" + price);
    }
}
```

再新建一个容器
``` java
public class BookList {
    //容器内部还是一个List，也可以用数组
    private List<Book> bookList = new ArrayList<Book>();
    private int index;
    
    //添加书籍
    public void addBook(Book book){
        bookList.add(book);
    }
    
    //删除书籍
    public void removeBook(Book book){
        int bookIndex = bookList.indexOf(book);
        bookList.remove(bookIndex);
    }
    
    //判断是否有下一本书
    public boolean hasNext(){
        if(index >= bookList.size()){
            return false;
        }
        return true;
    }
    
    //获得下一本书
    public Book getNext(){
        return bookList.get(index++);
    }
    
    //获取集合长度
    public int getSize(){
        return bookList.size();
    }
    
    //根据index获取Book
    public Book getByIndex(int index){
        return bookList.get(index);
    }
}
```
　　
接下来，就是迭代容器了，先采用第一种方式（由容器自己实现顺序遍历。直接在容器类里直接添加顺序遍历方法）
``` java
public class MainClass {
    public static void main(String[] args) {
        BookList bookList = new BookList();
        
        Book book1 = new Book("001","设计模式",200);
        Book book2 = new Book("002","Java核心编程",200);
        Book book3 = new Book("003","计算机组成原理",200);
        
        bookList.addBook(book1);
        bookList.addBook(book2);
        bookList.addBook(book3);
        
        while(bookList.hasNext()){
            Book book = bookList.getNext();
            book.display();
        }
    }
}
```
 
结果如下：  
<font color=#0099ff size=3 face="黑体">ID=001，name=设计模式，price=200.0</font>  
<font color=#0099ff size=3 face="黑体">ID=002，name=Java核心编程，price=200.0</font>  
<font color=#0099ff size=3 face="黑体">ID=003，name=计算机组成原理，price=200.0</font>  

然后是第二种方式（让调用者自己实现遍历。直接暴露数据细节给外部）
``` java
public class MainClass {
    public static void main(String[] args) {
        BookList bookList = new BookList();
        
        Book book1 = new Book("001","设计模式",200);
        Book book2 = new Book("002","Java核心编程",200);
        Book book3 = new Book("003","计算机组成原理",200);
        
        bookList.addBook(book1);
        bookList.addBook(book2);
        bookList.addBook(book3);
        
        for(int i = 0; i < bookList.getSize(); i++){
            Book book = bookList.getByIndex(i);
            book.display();
        }
    }
}
```

结果同上  

但这样，一定是有缺点的，不然就没有必要使用迭代模式了  

**不使用迭代模式的缺点**  
以上方法1与方法2都可以实现对遍历，但有这些问题  
1. 容器类承担了太多功能：一方面需要提供添加删除等本身应有的功能；一方面还需要提供遍历访问功能。
2. 往往容器在实现遍历的过程中，需要保存遍历状态，当跟元素的添加删除等功能夹杂在一起，很容易引起混乱和程序运行错误等。  

**应用迭代模式的条件**  
&emsp;&emsp;Iterator模式就是为了有效地处理按顺序进行遍历访问的一种设计模式，简单地说，Iterator模式提供一种有效的方法，可以屏蔽聚集对象集合的容器类的实现细节，而能对容器内包含的对象元素按顺序进行有效的遍历访问。  

所以，Iterator模式的应用场景可以归纳为满足以下几个条件：  
1. 访问容器中包含的内部对象
2. 按顺序访问

**迭代模式的结构**  
![迭代模式结构图](/img/blogs/2018/03/iterator-structure.png)  

**迭代模式的角色和职责**  
1. Iterator（迭代器接口）：  
该接口必须定义实现迭代功能的最小定义方法集，比如提供hasNext()和next()方法。
2. ConcreteIterator（迭代器实现类）：  
迭代器接口Iterator的实现类。可以根据具体情况加以实现。
3. Aggregate（容器接口）：  
定义基本功能以及提供类似Iterator iterator()的方法。
4. concreteAggregate（容器实现类）：  
容器接口的实现类。必须实现Iterator iterator()方法。  

接下来，用代码实现一下迭代模式，只需修改BookList即可
``` java
public class BookList {
    //容器内部还是一个List，也可以用数组
    private List<Book> bookList = new ArrayList<Book>();
    private int index;
    
    //添加书籍
    public void addBook(Book book){
        bookList.add(book);
    }
    
    //删除书籍
    public void removeBook(Book book){
        int bookIndex = bookList.indexOf(book);
        bookList.remove(bookIndex);
    }
    
    //判断是否有下一本书
//    public boolean hasNext(){
//        if(index >= bookList.size()){
//            return false;
//        }
//        return true;
//    }
    
    //获得下一本书
//    public Book getNext(){
//        return bookList.get(index++);
//    }
    
    //获取集合长度
    public int getSize(){
        return bookList.size();
    }
    
    //根据index获取Book
    public Book getByIndex(int index){
        return bookList.get(index);
    }
    
    //得到Iterator实例
    public Iterator Iterator() {
        return new Itr();
    }
    
    //内部类，Iterator实例（因为要使用容器的内部信息，所以要写成内部类）
    private class Itr implements Iterator{
        //判断是否有下一本书,将刚才hasNext()中内容复制过来即可
        public boolean hasNext() {
            if(index >= bookList.size()){
                return false;
            }
            return true;
        }
        //获得下一本书,将刚才getNext()中内容复制过来即可
        public Object next() {
            return bookList.get(index++);
        }

        public void remove() {
            
        }
    }
}
```

再在客户端实现一下
``` java
public class MainClass {
    public static void main(String[] args) {
        BookList bookList = new BookList();
        
        Book book1 = new Book("001","设计模式",200);
        Book book2 = new Book("002","Java核心编程",200);
        Book book3 = new Book("003","计算机组成原理",200);
        
        bookList.addBook(book1);
        bookList.addBook(book2);
        bookList.addBook(book3);
        
        Iterator iterator = bookList.Iterator();
        while(iterator.hasNext()){
            Book book = (Book) iterator.next();
            book.display();
        }
    }
}
```
可以看到，这和使用JDK提供集合的Iterator方法就一模一样了。

**迭代模式的优缺点**  
**优点：**  
1. 实现功能分离，简化容器接口。让容器只实现本身的基本功能，把迭代功能委让给外部类实现，符合类的设计原则。
2. 隐藏容器的实现细节。
3. 为容器或其子容器提供了一个统一接口，一方面方便调用；另一方面使得调用者不必关注迭代器的实现细节。
4. 可以为容器或其子容器实现不同的迭代方法或多个迭代方法。  

**缺点：**  
由于迭代器模式将存储数据和遍历数据的职责分离，增加新的聚合类需要对应增加新的迭代器类，类的个数成对增加，这在一定程度上增加了系统的复杂性。