# ts-challenge-helper

这是一个方便在本地环境中练习[type-challenges](https://github.com/type-challenges/type-challenges)题目的工具。

具体功能包括：

- 通过`tclh questionName`的方式在命令行界面查询题目，支持题目号码查询和名称模糊查询。
- 自动一个创建包含某题的`template.ts`、`test-cases.ts`、`README.md`和/或`README.zh-CN.md`的文件夹。
- 查询对应题目issue的前十个回答作为参考答案放进`referenceAnswer.ts`



## 使用方式

1. 全局安装依赖

   ```
   npm i -g ts-challenge-helper
   ```

   注意：请按照给出的安装方式全局安装，否则无法使用全局命令

2. 新建一个文件夹

3. 在文件夹下运行命令

   ```
   tclh questionName
   ```

   例如

   ```
   tclh trim
   #或者
   tclh 106
   ```

4. 输入展示的列表中展示题目序号



