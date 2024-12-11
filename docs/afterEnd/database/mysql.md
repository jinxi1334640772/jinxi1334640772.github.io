## 连接 MySQL

格式： mysql -h 主机地址 -u 用户名 －p 用户密码

```bash
#连接本机
mysql -uroot -proot
#连接远程
mysql -h10.0.0.10 -uroot -proot


mysql> use test;
mysql> source /home/test/database.sql;
```

## 导入导出

mysqldump -u[用户名] -h[ip] -p[密码] -P[端口号] 数据库名 表名 >导出的文件名.sql

```sql
# 导出education数据库里面的users表的表数据和表结构
mysqldump -uroot -h127.0.0.1 -proot -P3306 education users>d:/user.sql
```

## SQL 语法

```sql

SELECT VERSION();

CREATE SCHEMA `myblog`;

-- 创建表 id自增，并设为primaryKey
CREATE TABLE `myblog`.`users` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(20) NOT NULL,
	`password` VARCHAR(32) NOT NULL,
	`realname` VARCHAR(10) NOT NULL,
  `state` INT NOT NULL DEFAULT 1,
	PRIMARY KEY (`id`));

CREATE TABLE `myblog`.`blogs` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(50) NOT NULL,
	`content` LONGTEXT NOT NULL,
	`createtime` BIGINT(20) NOT NULL DEFAULT 0,
	`author` VARCHAR(20) NOT NULL,
	PRIMARY KEY (`id`));

use myblog

SHOW TABLES;

-- 新增数据
INSERT INTO users(username, `password`, realname) VALUES('ww', '123', 'wuwu');
INSERT INTO users(username, `password`, realname) VALUES('cc', '123', 'chenchen');
INSERT INTO users(username, `password`, realname) VALUES('dd', '123', 'didi');
INSERT INTO users(username, `password`, realname) VALUES('test', '123', 'testName');

-- 查询数据 条件查询 模糊查询 结果排序
SELECT * FROM users;
SELECT id, username FROM users;
SELECT * FROM users WHERE state=1;
SELECT * FROM users WHERE username='dd';
SELECT * FROM users WHERE username='dd' and `password`='123';
SELECT * FROM users WHERE username='dd' or `password`='123';
SELECT * FROM users WHERE username LIKE '%d%';
SELECT * FROM users ORDER BY id;
SELECT * FROM users ORDER BY id DESC;

SELECT * FROM blogs WHERE author='dd' ORDER BY createtime DESC;
SELECT * FROM blogs WHERE title LIKE '%����%' ORDER BY createtime DESC;

-- 更新指定条件的数据
UPDATE users set realname='didi2' WHERE username='dd';
UPDATE users set state=0 WHERE username='test';

-- 删除指定条件的数据
DELETE FROM users WHERE username='dd3';
DELETE FROM users WHERE id=6;

-- 插入/新增数据
INSERT INTO blogs(title, content, createtime, author) VALUES ('标题1', '内容1', '1618037480417', 'dd');
```

## 连接失败

```bash
# 进入 MySQL 安装目录 bin
$ cd /d  D:\Program Files\MySQL\MySQL Server 8.0\bin
# or
$ docker exec -it mysql-dd /bin/bash

# 登录root用户
$ mysql -u root -p;

# 查看mysql
$ use mysql;

# 查看当前主机配置信息为
$ select host from user where user='root';

# 注生产环境不可这样配置,应配置账号权限
# 设置为通配符%
$ update user set host = '%' where user ='root';

# 刷新MySQL的系统权限相关表
$ flush privileges;
```
