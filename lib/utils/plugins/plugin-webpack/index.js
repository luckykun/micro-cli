const fs = require('fs-extra');
const path = require('path');
const { microConfig } = require('../../index');

const { copyFilePath } = microConfig;
const cwd = process.cwd();

// 打包完成后，拷贝文件到输出目录
class CopyFilesPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('CopyFilesPlugin', (compilation, callback) => {
      if (!copyFilePath) { // 如果项目中没有配置需要拷贝的文件，直接进行下一步
        return callback();
      }

      const arr = copyFilePath.split('/');
      const fileName = arr[arr.length - 1];
      const outputPath = compilation.outputOptions.path; // Webpack的输出目录

      const source = path.join(cwd, copyFilePath); // 需要拷贝的文件路径
      const target = path.join(outputPath, fileName); // 完整的目标路径

      // 将文件内容写入目标文件
      fs.writeFileSync(target, fs.readFileSync(source, 'utf-8'));
      console.log(`拷贝文件成功：${copyFilePath} -> ${target}`);

      callback();
    });
  }
}

module.exports = CopyFilesPlugin;
