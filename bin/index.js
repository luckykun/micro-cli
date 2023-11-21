#!/usr/bin/env node
const program = require('commander');
const init = require('../lib/init');
const dev = require('../lib/dev');


program.command('init <projectName> [other...]')
  .description('创建项目')
  .action((projectName) => { // 命令行的执行逻辑代码
    init(projectName);
  });


program.command('dev')
  .description('启动项目开发环境')
  .action(() => {
    dev();
  });

program.parse(process.argv);
