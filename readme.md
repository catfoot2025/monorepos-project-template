# 初始化项目

```shell
pnpm init
```

注意！pnpm 不支持-y参数

执行完该命令后，在根目录下将创建一个package.json文件，内容如下：

```json
{
  "name": "monorepos-project-template",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "packageManager": "pnpm@10.13.0"
}
```

# 初始化本地仓库

```shell
git init
```

将项目提交到远程仓库

```shell
# 添加到暂存区
git add .
# 提交到本地仓库
git commit -m "创建并初始化项目"
# 为远程仓库创建别名
git remote add mpt git@github.com:catfoot2025/monorepos-project-template.git
# 将本地库提交到远程仓库
git push mpt master
```

# 添加编辑器格式支持

https://editorconfig.org/

> What is EditorConfig?
>
> EditorConfig helps maintain consistent coding styles for multiple developers working on the same project across various editors and IDEs. The EditorConfig project consists of **a file format** for defining coding styles and a collection of **text editor plugins** that enable editors to read the file format and adhere to defined styles. EditorConfig files are easily readable and they work nicely with version control systems.

## 在根目录下添加.editorconfig

```ini
root = true

[*]
# 使用utf-8编码
charset = utf-8
# 使用空格作为缩进符，而不是使用tab
indent_style = space
# 缩进符数量为2
indent_size = 2
# 指定文件的换行符类型。它的核心作用是强制文件使用 ​Unix/Linux 风格的换行符（\n）​，确保代码在不同操作系统间的一致性。
end_of_line = lf
# 强制在文件末尾添加一个空行​（即换行符 \n），确保文件以空行结束
# 某些工具（如 Shell 脚本、CI/CD 流水线）可能因文件末尾无空行而报错（例如 grep 可能漏解析最后一行）。
insert_final_newline = true
# 自动删除每行末尾的空白字符​（包括空格   和制表符 \t），保持代码整洁。
trim_trailing_whitespace = true
# 使用单引号
quote_type = single

```

## 验证路径是否正确

验证该文件是否能够被vscode正确读取

```
在 VS Code 中打开命令面板（Ctrl+Shift+P），执行 EditorConfig: Open Editor Config File，若能打开系统根目录的 .editorconfig，说明路径正确。
```

## 测试

创建src/index.js

```js
const add = (a, b) => {
  return a + b
}

const str = 'fdfdfd'
const str1 = 'fdfdfdfdfd'

const sub = (a, b) => {
  const str = 'fdfd'
  return a - b
}
```

在vscode中执行格式化操作。在settings中搜索Format on save，勾选这个选项。当进行代码保存时会自动进行格式化。

```js
const add = (a, b) => {
  return a + b
}

const str = 'fdfdfd'
const str1 = 'fdfdfdfdfd'

const sub = (a, b) => {
  const str = 'fdfdfd'
  return a - b
}
```

在idea中进行测试。在settings--editor--【code style】中 【scheme】选择project，勾选enable editorconfig support。

```js
const add = (a, b) => {
  return a + b
}

const str = 'fdfdfd'
const str1 = 'fdfdfdfdfd'

const sub = (a, b) => {
  const str = 'fdfd'
  return a - b
}
```

发现双引号好并没有变成单引号，并且在idea中对.editorconfig中的`quote_type = single`有警告，提示idea不支持该选项。也就是说不同编辑器对.editorconfig规范支持的不一样。这时候就需要请出一个对代码风格规范更强大的工具了，它就是prettier。

# 添加prettier

## 安装prettier

```json
pnpm add prettier -D
```

## 添加.prettierrc

```json
{
  "semi": false, // 不加分号
  "singleQuote": true, // 使用单引号
  "overrides": [
    {
      "files": ".prettierrc", // 以json方式解析.prettierrc文件
      "options": {
        "parser": "json"
      }
    }
  ]
}
```

## 添加.prettierignore

对于有些文件不需要使用prettier进行代码格式化，所以需要把它进行排除。排除的对象既可以是某个文件，也可以是某个文件夹。或者是任何符合glob规范的表达式

```
dist
node_modules
pnpm-lock.yaml
```

## 测试

在vscode中如果安装了prettier插件，在保存时该插件会自动读取.prettierrc配置，对代码进行格式化。

新版本的idea(2023.2.5)已经自带了prettier插件，在settings--languages&Frameworks--javasript--prettier下，选择【Manual Prettier Configuration】，在Prettier Package中选择本项目目录下的prettier，选择【run on reformat code action】，选择【Run on save】。

配置完成后，在vscode或者idea中进行保存操作时会自动对文件进行格式化。

# 添加.gitignore

```
# Editor directories and files
.idea

# Package Manager
node_modules
.pnpm-debug.log*

# System
# mac系统
.DS_Store

# Bundle
dist


# local env files
#.local 文件通常是本地开发环境的专用配置，用于存储：
#敏感信息（如 API 密钥、数据库密码）；
#本地调试参数（如 DEBUG=true、PORT=3000）；
#临时覆盖的全局配置（如 .npmrc.local 覆盖全局 npm 配置）。
*.local
.eslintcache

```
