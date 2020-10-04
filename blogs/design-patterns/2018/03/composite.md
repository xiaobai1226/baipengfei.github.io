---
title: Java设计模式-----13、组合模式
date: 2018-03-15 16:16:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./facade
next: ./bridge
---

&emsp;&emsp;Composite模式也叫组合模式，是构造型的设计模式之一。通过递归手段来构造树形的对象结构，并可以通过一个对象来访问整个对象树。  
&emsp;&emsp;组合(Composite)模式的其它翻译名称也很多，比如合成模式、树模式等等。在《设计模式》一书中给出的定义是：将对象以树形结构组织起来，以达成“部分－整体”的层次结构，使得客户端对单个对象和组合对象的使用具有一致性。  
&emsp;&emsp;从定义中可以得到使用组合模式的环境为：在设计中想表示对象的“部分－整体”层次结构；希望用户忽略组合对象与单个对象的不同，统一地使用组合结构中的所有对象。
![组合模式结构图](/img/blogs/2018/03/composite-structure.png)
 
**组合模式的角色和职责**  
1. Component （树形结构的节点抽象）  
1.1. 为所有的对象定义统一的接口（公共属性，行为等的定义）  
1.2. 提供管理子节点对象的接口方法  
1.3. [可选]提供管理父节点对象的接口方法  
2. Leaf （树形结构的叶节点）  
Component的实现子类
3. Composite（树形结构的枝节点）  
Component的实现子类  

**安全性与透明性**  
&emsp;&emsp;组合模式中必须提供对子对象的管理方法，不然无法完成对子对象的添加删除等等操作，也就失去了灵活性和扩展性。但是管理方法是在Component中就声明还是在Composite中声明呢？  
&emsp;&emsp;一种方式是在Component里面声明所有的用来管理子类对象的方法，以达到Component接口的最大化（如下图所示）。目的就是为了使客户看来在接口层次上树叶和分支没有区别——**透明性**。但树叶是不存在子类的，因此Component声明的一些方法对于树叶来说是不适用的。这样也就带来了一些安全性问题。

![组合模式结构图](/img/blogs/2018/03/composite-structure1.png)

&emsp;&emsp;另一种方式就是只在Composite里面声明所有的用来管理子类对象的方法（如下图所示）。这样就避免了上一种方式的安全性问题，但是由于叶子和分支有不同的接口，所以又失去了透明性。  

![组合模式结构图](/img/blogs/2018/03/composite-structure2.png)

&emsp;&emsp;《设计模式》一书认为：在这一模式中，相对于安全性，我们比较强调透明性。对于第一种方式中叶子节点内不需要的方法可以使用空处理或者异常报告的方式来解决。  
&emsp;&emsp;我们举个例子，比如说文件夹与文件，层次结构就符合树形结构  

&emsp;&emsp;首先我们新建一个Component接口（树形结构的节点抽象）
``` java
/*
 * 文件节点抽象(是文件和目录的父类)
 */
public interface IFile {
    
    //显示文件或者文件夹的名称
    public void display();
    
    //添加
    public boolean add(IFile file);
    
    //移除
    public boolean remove(IFile file);
    
    //获得子节点
    public List<IFile> getChild();
}
```

该例子符合透明性，如果是安全性，将IFile中的方法去除，不在IFile声明，直接在子类中声明即可。  

接下来，创建一个Leaf（叶子结点），因为文件是不可再分的，所以File是叶子结点
``` java
/*
 * 文件（leaf 叶子结点）
 */
public class File implements IFile {
    private String name;
    
    public File(String name) {
        this.name = name;
    }
    

    public void display() {
        System.out.println(name);
    }

    public List<IFile> getChild() {
        return null;
    }


    public boolean add(IFile file) {
        return false;
    }

    public boolean remove(IFile file) {
        return false;
    }

}
```

然后继续创建Composite(文件夹)，因为文件夹下面还可能有文件与文件夹，所以是composite
``` java
public class Folder implements IFile{
    private String name;
    private List<IFile> children;
    
    public Folder(String name) {
        this.name = name;
        children = new ArrayList<IFile>();
    }
    
    public void display() {
        System.out.println(name);
    }

    public List<IFile> getChild() {
        return children;
    }

    public boolean add(IFile file) {
        return children.add(file);
    }

    public boolean remove(IFile file) {
        return children.remove(file);
    }
}
```

然后是客户端，用递归的形式把这个具有树形结构的对象遍历出来
``` java
public class MainClass {
    public static void main(String[] args) {
        //C盘
        Folder rootFolder = new Folder("C:");
        //C盘下的目录一
        Folder folder1 = new Folder("目录一");
        //C盘下的文件一
        File file1 = new File("文件一.txt");
        
        rootFolder.add(folder1);
        rootFolder.add(file1);
        
        //目录一下的目录二
        Folder folder2 = new Folder("目录二");
        //目录一下的文件二
        File file2 = new File("文件二.txt");
        folder1.add(folder2);
        folder1.add(file2);
        
        //目录二下的目录三
        Folder folder3 = new Folder("目录三");
        //目录二下的文件三
        File file3 = new File("文件三.txt");
        folder2.add(folder3);
        folder2.add(file3);
        
        displayTree(rootFolder,0);
        
    }
    
    public static void displayTree(IFile rootFolder, int deep) {
        for(int i = 0; i < deep; i++) {
            System.out.print("--");
        }
        //显示自身的名称
        rootFolder.display();
        //获得子树
        List<IFile> children = rootFolder.getChild();
        //遍历子树
        for(IFile file : children) {
            if(file instanceof File) {
                for(int i = 0; i <= deep; i++) {
                    System.out.print("--");
                }
                file.display();
            }else {
                displayTree(file,deep + 1);
            }
        }
    }
}
```
这样子，就把，这棵树遍历了出来。

**优点：**
1. 使客户端调用简单，客户端可以一致的使用组合结构或其中单个对象，用户就不必关心自己处理的是单个对象还是整个组合结构，这就简化了客户端代码。
2. 更容易在组合体内加入对象部件. 客户端不必因为加入了新的对象部件而更改代码。这一点符合开闭原则的要求，对系统的二次开发和功能扩展很有利！

**缺点：**  
组合模式不容易限制组合中的构件。

**总结：**  
组合模式是一个应用非常广泛的设计模式，它本身比较简单但是很有内涵，掌握了它对你的开发设计有很大的帮助。