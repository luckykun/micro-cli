const { insertContent } = require('./utils');

module.exports = (babel) => {
  const { types } = babel;
  const result = {
    injectMiDeclaration: false, // 保存标记：是否要注入 const mi = window.__miUitls
    injectGlobalReact: false, // 保存标记：是否需要注入 import React from 'react';
    uiComponents: [], // 保存需要注入的UI组件变量，比如 const UIButton = window.__miUI.Button
  };

  return {
    visitor: {
      Program: {
        enter() {
          result.injectGlobalReact = false;
          result.injectMiDeclaration = false;
          result.uiComponents = [];
        },
        exit(path) {
          // 注入React的import语法
          if (result.injectGlobalReact) {
            const reactImportDeclaration = types.importDeclaration(
              [types.importDefaultSpecifier(types.identifier('React'))],
              types.stringLiteral('react'),
            );
            path.node.body.unshift(reactImportDeclaration);
          }

          // 查找最后一个import的位置
          let lastImportIndex = -1;
          path.node.body.forEach((node, index) => {
            if (types.isImportDeclaration(node)) {
              lastImportIndex = index;
            }
          });

          if (result.injectMiDeclaration) {
            insertContent({ path, types, index: lastImportIndex, name: 'mi', value: 'window.__miUitls' });
          }

          if (result.uiComponents.length > 0) {
            result.uiComponents.forEach(({ oldName, newName }) => {
              insertContent({ path, types, index: lastImportIndex, name: newName, value: `window.__miUI.${oldName}` });
            });
          }
          // console.log(path.toString()); // 打印整个文件的源代码
        },
      },

      MemberExpression(path) {
        const { node } = path;
        if (node.object) {
          const { type, name } = node.object;
          if (type === 'Identifier' && name === 'mi') {
            result.injectMiDeclaration = true;
          }
          if (type === 'Identifier' && name === 'React') {
            result.injectGlobalReact = true;
          }
        }
      },

      JSXElement(path) {
        const { node } = path;
        const openName = node.openingElement.name;
        result.injectGlobalReact = true;
        if (types.isJSXMemberExpression(openName) && types.isJSXIdentifier(openName.object, { name: 'UI' })) {
          const componentName = openName.property.name;
          const newComponentName = `UI${componentName}`;
          result.uiComponents.push({
            oldName: componentName, // Button
            newName: newComponentName, // UIButton
          });

          const tagName = types.jsxIdentifier(newComponentName);
          node.openingElement.name = tagName;
          if (node.closingElement) {
            node.closingElement.name = tagName;
          }
          path.replaceWith(node);
        }
      },
    },
  };
};
