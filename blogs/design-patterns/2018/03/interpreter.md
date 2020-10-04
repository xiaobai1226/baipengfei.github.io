---
title: Java设计模式-----16、解释器模式
date: 2018-03-20 15:42:00
tags:
 - 设计模式
categories:
 - 设计模式
prev: ./adapter
next: ./mediator
---

**概念：**  
&emsp;&emsp;Interpreter模式也叫解释器模式，是行为模式之一，它是一种特殊的设计模式，它建立一个解释器，对于特定的计算机程序设计语言，用来解释预先定义的文法。简单地说，Interpreter模式是一种简单的语法解释器构架。　

**解释器模式应用场景**  
&emsp;&emsp;当有一个语言需要解释执行, 并且你可将该语言中的句子表示为一个抽象语法树时，可使用解释器模式。而当存在以下情况时该模式效果最好： 
1. 该文法简单，对于复杂的文法, 文法的类层次变得庞大而无法管理。此时语法分析程序生成器这样的工具是更好的选择。它们无需构建抽象语法树即可解释表达式, 这样可以节省空间而且还可能节省时间。 
2. 效率不是一个关键问题，最高效的解释器通常不是通过直接解释语法分析树实现的, 而是首先将它们转换成另一种形式。例如，正则表达式通常被转换成状态机。但即使在这种情况下, 转换器仍可用解释器模式实现, 该模式仍是有用的。  

**结构图**  
![解释器模式结构图](/img/blogs/2018/03/interpreter1.png)  

**解释器模式的角色和职责**  
1. Context：解释器上下文环境类。用来存储解释器的上下文环境，比如需要解释的文法等，简单来说，它的任务一般是用来存放文法中各个终结符所对应的具体值，比如R=R1+R2，给R1赋值100，给R2赋值200，这些信息需要存放到环境中。
2. AbstractExpression：解释器抽象类。抽象表达式，声明一个所有的具体表达式都需要实现的抽象接口；这个接口主要是一个interpret()方法，称做解释操作。
3. Terminal Expression：终结符表达式，解释器具体实现类，实现了抽象表达式所要求的接口；文法中的每一个终结符都有一个具体终结表达式与之相对应。比如公式R=R1+R2，R1和R2就是终结符，对应的解析R1和R2的解释器就是终结符表达式。
4. Nonterminal Expression：非终结符表达式，解释器具体实现类，文法中的每一条规则都需要一个具体的非终结符表达式，非终结符表达式一般是文法中的运算符或者其他关键字，比如公式R=R1+R2中，“+"就是非终结符，解析“+”的解释器就是一个非终结符表达式。
5. Client：客户端，指的是使用解释器的客户端，通常在这里将按照语言的语法做的表达式转换成使用解释器对象描述的抽象语法树，然后调用解释操作。  

举一个计算器的例子  
首先，新建一个Context，通过一个map来存储上下文信息  
``` java
/*
 * 解释器上下文环境类
 */
public class Context {
    private Map<Character, Double> variable;

    public Map<Character, Double> getVariable() {
        if (this.variable == null){
            this.variable = new HashMap<Character, Double>();
        }
        return this.variable;
    }
    
    //返回结果
    public void setVariable(Map<Character, Double> variable) {
        this.variable = variable;
    }
}
```

再新建AbstractExpression
``` java
/*
 * 抽象表达式
 */
public abstract class Expression {
    public abstract double Interpret(Context context);
}
```

新建Terminal Expression
``` java
/*
 * 变量，终结符表达式
 */
public class VariableExpression extends Expression {
    private char key;
    
    public VariableExpression(char key){
        this.key = key;
    }
    
    @Override
    public double Interpret(Context context) {
        return context.getVariable().get(key);
    }
}
```

&emsp;&emsp;再新建Nonterminal Expression，因为这其中包含许多不同的实现功能，比如加减乘除，所以我们先新建一个抽象类，再新建不同的实现类  

抽象运算符号解析器
``` java
/*
 * 操作符，非终结符表达式
 */
public abstract class OperatorExpression extends Expression {
    protected Expression left;
    protected Expression right;

    public OperatorExpression(Expression left, Expression right){
        this.left = left;
        this.right = right;
    }
}
```

具体的解析器
``` java
/*
 * 加法解析器
 */
public class AddExpression extends OperatorExpression {

    public AddExpression(Expression left, Expression right) {
        super(left, right);
    }

    @Override
    public double Interpret(Context context) {
        return this.left.Interpret(context) + this.right.Interpret(context);
    }
}

/*
 * 减法解析器
 */
public class SubExpression extends OperatorExpression {

    public SubExpression(Expression left, Expression right) {
        super(left, right);
    }

    @Override
    public double Interpret(Context context) {
        return this.left.Interpret(context) - this.right.Interpret(context);
    }
}

/*
 * 乘法解析器
 */
public class MulExpression extends OperatorExpression {

    public MulExpression(Expression left, Expression right) {
        super(left, right);
    }

    @Override
    public double Interpret(Context context) {
        return this.left.Interpret(context) * this.right.Interpret(context);
    }
}

/*
 * 除法解析器
 */
public class DivExpression extends OperatorExpression {

    public DivExpression(Expression left, Expression right) {
        super(left, right);
    }

    @Override
    public double Interpret(Context context) {
        return this.left.Interpret(context) / this.right.Interpret(context);
    }
}
```

接下来，新建一个解析器封装类  
&emsp;&emsp;解析器封装类，这个类是根据迪米特法则进行封装，他并不是解释器模式的组成部分，目的是让Client只与功能模块打交道，不涉及到具体的实现，相当于Facade（外观模式）
``` java
public class Calculator {
    private String expression;
    private Context context;

    public Calculator(String expression){
        this.expression = expression;
        this.context = new Context();
    }

    public double Calculate(){
        char[] vars = this.expression.toCharArray();
        for(char c : vars){
            if (c == '+' || c == '-' || c == '*' || c == '/'){
                continue;
            }
            if (!this.context.getVariable().containsKey(c)){    
                System.out.println("请输入一个数字：");
                System.out.print(c+"=");
                Scanner sn = new Scanner(System.in);
                String readLine = sn.next();
                this.context.getVariable().put(c, Double.parseDouble(readLine));
            }
        }
        Expression left = new VariableExpression(vars[0]);
        Expression right = null;
        Stack<Expression> stack = new Stack<Expression>();
        stack.push(left);
        for (int i = 1; i < vars.length; i += 2){
            left = stack.pop();
            right = new VariableExpression(vars[i + 1]);
            switch (vars[i]){
                case '+':
                    stack.push(new AddExpression(left, right));
                    break;
                case '-':
                    stack.push(new SubExpression(left, right));
                    break;
                case '*':
                    stack.push(new MulExpression(left, right));
                    break;
                case '/':
                    stack.push(new DivExpression(left, right));
                    break;
            }
        }
        double value = stack.pop().Interpret(this.context);
        stack.clear();
        return value;
    }
}
```

最后，是客户端，解释器的使用者
``` java
//Client客户端
public class Client {
   public static void main(String[] args) {
       Calculator c = new Calculator("a*b/c");
       System.out.println("结果等于" + c.Calculate());
    }
}
```

运行结果：  
<font color=#0099ff size=3 face="黑体">请输入一个数字：</font>  
<font color=#0099ff size=3 face="黑体">a=10</font>  
<font color=#0099ff size=3 face="黑体">请输入一个数字：</font>  
<font color=#0099ff size=3 face="黑体">b=5</font>  
<font color=#0099ff size=3 face="黑体">请输入一个数字：</font>  
<font color=#0099ff size=3 face="黑体">c=2</font>  
<font color=#0099ff size=3 face="黑体">结果=25.0</font>  
　　
**优点：**  
1. 可扩展性比较好，灵活。 
2. 增加了新的解释表达式的方式。 
3. 易于实现简单文法。  

**缺点：**  
1. 可利用场景比较少。 
2. 对于复杂的文法比较难维护。 
3. 解释器模式会引起类膨胀。 
4. 解释器模式采用递归调用方法。