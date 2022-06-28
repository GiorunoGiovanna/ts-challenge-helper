#!/usr/bin/env node
const fs = require('fs')
const { cwd } = require('process');
const path = require('path');
const axios = require('axios');
const { Command } = require('commander');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
const child_process = require('child_process');

const program = new Command();

program
    .version('0.1.0')
    .argument("<dirName...>", 'folder name')
    .action((dirName) => {
        //通过正则匹配对应的文件
        //如果是数字
        let reg
        dirName = dirName[0]
        if (/\d/.test(dirName)) {
            reg = new RegExp(`${dirName}-`)
        } else {
            reg = new RegExp(`${dirName}`)
        }
        // 同过github Api去查找仓库中的问题
        // todo:只能查找1000题
        axios.get('https://api.github.com/repos/antFu/type-challenges/contents/questions')
            .then(res => {
                let questions = []
                res.data.map(m => questions.push(m.name))
                questions = questions.filter(m => reg.test(m))

                console.log('which one is wanted?')

                questions.map((m, i) => console.log(i + 1, m))
                readline.on('line', function (line) {
                    if (line <= 0 || line > questions.length) {
                        console.log('wrong number! place enter again')
                    } else {
                        let name = questions[line - 1]
                        let dirMC = path.resolve(cwd(), 'mychallenge')
                        let dirMCN = path.resolve(cwd(), `mychallenge/${name}`)
                        let dirMCNA = path.resolve(cwd(), `mychallenge/${name}/referenceAnswer.ts`)

                        console.log('ok, please wait...')
                        console.log(`buliding ${name}`)

                        //通过api找到content，用base64编码解码存进去
                        //找到对应的文件，将README.md或者README.zh-CN.md,template.ts,test-cases.ts加到mychallenge文件夹下
                        if (!fs.existsSync(dirMC)) {
                            fs.mkdirSync(dirMC);
                        }
                        let flies = ['template.ts', 'test-cases.ts', 'README.zh-CN.md', 'README.md'], requests = []
                        for (flie of flies) {
                            requests.push(axios.get(`https://api.github.com/repos/antFu/type-challenges/contents/questions/${name}/${flie}`))
                        }
                        if (!fs.existsSync(dirMCN)) {
                            fs.mkdirSync(dirMCN);
                        }
                        axios.all(requests).then(results => {
                            // console.log(results)
                            for (result of results) {
                                if (result.data.content) {
                                    let dirMCNN = path.resolve(cwd(), `mychallenge/${name}/${result.data.name}`)
                                    fs.writeFileSync(dirMCNN, new Buffer.from(result.data.content, 'base64').toString())
                                }
                            }
                        }).catch(err => console.log(err))
                        // for (list of question) {
                        //     if (/template.ts|test-cases.ts|README.zh-CN.md|README.md/.test(list)) {
                        //         if (!fs.existsSync(`mychallenge/${name}`)) {
                        //             fs.mkdirSync(`mychallenge/${name}`);
                        //         }
                        //         fs.writeFileSync(`mychallenge/${name}/${list}`, fs.readFileSync(`questions/${name}/${list}`));
                        //     }
                        // }

                        //使用github Api获取issue前十的相关issue
                        let labels = name.substring(0, 5) * 1
                        axios.get(`https://api.github.com/repos/antFu/type-challenges/issues?labels=${labels}&per_page=10`
                        ).then(res => {
                            // 遍历所有data的body，正则匹配出所有答案
                            let results = '', datas = res.data
                            for (data of datas) {
                                results += data.body.match(/(?<=```ts).*(?=```)/gs)
                            }
                            // 写一个文件，把这些内容写进去
                            fs.writeFileSync(dirMCNA, results);
                        })
                        readline.close()
                    }
                })
            })
    })

program
    .command("shell")
    .action(() => {
    })

program.parse(child_process.argv);