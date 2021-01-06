/*
 * @Author: your name
 * @Date: 2019-11-14 16:02:24
 * @LastEditTime: 2019-11-18 14:18:45
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /applets-piano-school-teacher/file.create.js
 */
const fs = require('fs-extra')
const params = process.argv;
//新建类型
const type = {
    pages: '页面',
    components: '组件'
};

let projectName = params[2];
let dirName = params[3];
//创建文件夹
fs.mkdirsSync(`./src/${projectName}/${dirName}`)
fs.readdir(`./src/${projectName}/${dirName}`).then(res => {
    if (!res.length) {
        try {
            fs.copySync('./template', `./src/${projectName}/${dirName}`)
            console.error(`⚡️——${type[projectName]}新建成功 \n 请查看${projectName} ——> ${dirName}文件夹`)
        } catch (err) {
            console.error('❌失败', err)
        }
    } else {
        console.log("😡 😔 😡 😔 😡 😔 😡\n已经创建，请不要重复创建，以免覆盖！")
    }
})