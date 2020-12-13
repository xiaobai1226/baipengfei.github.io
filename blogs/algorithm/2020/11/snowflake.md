---
title: Java实现Twitter雪花算法(Snowflake)
date: 2020-11-19 19:11:00
sidebar: 'auto'
tags:
 - 算法
categories:
 - 算法
---

## 概述
SnowFlake算法生成id的结果是一个64bit大小的整数，它的结构如下图：
![snowflake](/img/blogs/2020/11/snowflake1.png)  
* **第1位：** 不用，二进制中最高位为1的都是负数，但是我们生成的id一般都使用整数，所以这个最高位固定是0  
* **第2到42位：** 共41位用来记录时间戳（毫秒）。41位bit可以表示2^41−1个数字，如果只用来表示正整数（计算机中正数包含0），可以表示的数值范围是：0 至 2^41−1。也就是说41位可以表示2^41−1个毫秒的值，转化成单位年则是(2^41−1)/(1000∗60∗60∗24∗365)=69年。  
* **第43位到52位：** 共10位，用来记录工作机器id。可以部署在2^10=1024个节点，包括5位datacenterId和5位workerId，5位（bit）可以表示的最大正整数是2^5−1=31，即可以用0、1、2、3、....31这32个数字，来表示不同的datecenterId或workerId。  
* **53位到64位：** 共12位作为序列号，用来记录同一毫秒内产生的不同id。12位（bit）可以表示的最大正整数是2^12−1=4095，即可以用0、1、2、3、....4094这4095个数字，来表示同一机器同一时间截（毫秒)内产生的4095个ID序号。  
**由于在Java中64bit的整数是long类型，所以在Java中SnowFlake算法生成的id就是long来存储的。**

## 雪花算法的作用
SnowFlake可以保证：  
1. 所有生成的id按时间趋势递增
2. 整个分布式系统内不会产生重复id（因为有datacenterId和workerId来做区分）

## 雪花算法的Java代码实现
``` java
public class SnowFlakeUtils {
    /**
     * 起始的时间戳:这个时间戳自己随意获取，比如自己代码的时间戳
     */
    private final static long START_STMP = 1543903501000L;

    /**
     * 每一部分占用的位数
     */
    // 序列号占用的位数
    private final static long SEQUENCE_BIT = 12;
    // 机器标识占用的位数
    private final static long MACHINE_BIT = 5;
    // 数据中心占用的位数
    private final static long DATACENTER_BIT = 5;

    /**
     * 每一部分的最大值：先进行左移运算，再同-1进行异或运算；异或：相同位置相同结果为0，不同结果为1
     */
    /**
     * 用位运算计算出最大支持的数据中心数量：31
     */
    private final static long MAX_DATACENTER_NUM = -1L ^ (-1L << DATACENTER_BIT);

    /**
     * 用位运算计算出最大支持的机器数量：31
     */
    private final static long MAX_MACHINE_NUM = -1L ^ (-1L << MACHINE_BIT);

    /**
     * 用位运算计算出12位能存储的最大正整数：4095
     */
    private final static long MAX_SEQUENCE = -1L ^ (-1L << SEQUENCE_BIT);

    /**
     * 每一部分向左的位移
     */

    /**
     * 机器标志较序列号的偏移量
     */
    private final static long MACHINE_LEFT = SEQUENCE_BIT;

    /**
     * 数据中心较机器标志的偏移量
     */
    private final static long DATACENTER_LEFT = SEQUENCE_BIT + MACHINE_BIT;

    /**
     * 时间戳较数据中心的偏移量
     */
    private final static long TIMESTMP_LEFT = DATACENTER_LEFT + DATACENTER_BIT;

    /**
     * 数据中心
     */
    private static long datacenterId;

    /**
     * 机器标识
     */
    private static long machineId;

    /**
     * 序列号
     */
    private static long sequence = 0L;

    /**
     * 上一次时间戳
     */
    private static long lastStmp = -1L;

    /**
     * 此处无参构造私有，同时没有给出有参构造，在于避免以下两点问题：
     * 1、私有化避免了通过new的方式进行调用，主要是解决了在for循环中通过new的方式调用产生的id不一定唯一问题问题，因为用于记录上一次时间戳的lastStmp永远无法得到比对；
     * 2、没有给出有参构造在第一点的基础上考虑了一套分布式系统产生的唯一序列号应该是基于相同的参数
     */
    private SnowFlakeUtils() {
    }

    /**
     * 产生下一个ID,指定数据中心与机器标识
     *
     * @return
     */
    public static long nextId(long machineId1, long datacenterId1) {

        if (machineId1 > MAX_MACHINE_NUM || machineId1 < 0) {
            throw new IllegalArgumentException(String.format("machineId can't be greater than %d or less than 0", MAX_MACHINE_NUM));
        }
        if (datacenterId1 > MAX_DATACENTER_NUM || datacenterId1 < 0) {
            throw new IllegalArgumentException(String.format("datacenterId can't be greater than %d or less than 0", MAX_DATACENTER_NUM));
        }

        datacenterId = datacenterId1;
        machineId = machineId1;

        return nextId();
    }

    /**
     * 产生下一个ID
     *
     * @return
     */
    public static synchronized long nextId() {
        /** 获取当前时间戳 */
        long currStmp = System.currentTimeMillis();

        /** 如果当前时间戳小于上次时间戳则抛出异常 */
        if (currStmp < lastStmp) {
            throw new RuntimeException("Clock moved backwards.  Refusing to generate id");
        }
        /** 相同毫秒内 */
        if (currStmp == lastStmp) {
            //相同毫秒内，序列号自增
            sequence = (sequence + 1) & MAX_SEQUENCE;
            //同一毫秒的序列数已经达到最大
            if (sequence == 0L) {
                /** 获取下一时间的时间戳并赋值给当前时间戳 */
                currStmp = getNextMill();
            }
        } else {
            //不同毫秒内，序列号置为0
            sequence = 0L;
        }
        /** 当前时间戳存档记录，用于下次产生id时对比是否为相同时间戳 */
        lastStmp = currStmp;

        return ((currStmp - START_STMP) << TIMESTMP_LEFT) //时间戳部分
                | (datacenterId << DATACENTER_LEFT)     //数据中心部分
                | (machineId << MACHINE_LEFT)           //机器标识部分
                | sequence;                            //序列号部分
    }

    private static long getNextMill() {
        long mill = System.currentTimeMillis();
        while (mill <= lastStmp) {
            mill = System.currentTimeMillis();
        }
        return mill;
    }
}
```