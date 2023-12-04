#!/usr/bin/env node
const program = require('commander');
const init = require('../lib/commands/init');
const dev = require('../lib/commands/dev');
const build = require('../lib/commands/build');


program.command('init <projectName> [other...]')
  .description('创建项目')
  .option('-T, --type [type]', '模板类型')
  .action((projectName) => { // 命令行的执行逻辑代码
    init(projectName);
  });


program.command('dev')
  .description('启动项目开发环境')
  .option('-H, --host [host]', '调式服务的IP')
  .option('-P, --port [port]', '调试服务监听端口')
  .option('-A, --analyse [analyse]', '是否开启性能检查')
  .action((options) => {
    dev(options);
  });


program.command('build')
  .description('项目打包')
  .option('-A, --analyse [analyse]', '是否开启性能检查')
  .action((options) => {
    build(options);
  });

program.parse(process.argv);
