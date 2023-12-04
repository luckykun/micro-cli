const inquirer = require('inquirer');

module.exports = (projectName) => {
  inquirer.prompt([{ // 数组中每一个对象表示一个问题
    type: 'list', // 问题类型，list表示选择列表
    name: 'framework', // 用于接收答案的键值
    choices: ['react', 'vue', 'micro'], // 选项
    message: '请选择你所使用的框架', // 问题
  }]).then((answer) => {
    console.log('projectName', projectName);
    console.log('answer', answer);
  });
};
