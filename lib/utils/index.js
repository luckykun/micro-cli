const path = require('path');
const fs = require('fs-extra');
const execa = require('execa');
const chalk = require('chalk');


const microPath = path.join(process.cwd(), 'micro.json');
const config = fs.existsSync(microPath) ? fs.readJSONSync(microPath) : {};

const { name, isCommon, cssExtract = true, filename = 'app.min' } = config;

Object.assign(config, {
  isProd: () => process.env.NODE_ENV === 'production',
  filename,
  cssExtract,
  microName: name,
  isCommonMicroApp: isCommon,
  isSpecialMicroApp: ['root', 'lib'].includes(name),
});


const utils = {
  /** 日志打印 */
  info: (message) => console.log(chalk.cyan(message)),
  success: (message) => console.log(chalk.green(message)),
  warn: (message) => console.log(chalk.yellow(message)),
  error: (message) => console.log(chalk.red(message)),
  log: (message, type = 'cyan') => console.log(chalk[type](message)),

  /** 通用执行shell脚本的方法 */
  shell: execa.shell,
  shellSync: (cli, args) => execa.shellSync(cli, { stdio: [0, 1, 2], ...args }),
};

exports.microxConfig = config;

exports.utils = utils;
