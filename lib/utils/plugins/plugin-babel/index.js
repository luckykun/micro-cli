const { insertContent } = require('./utils');

module.exports = (babel) => {
  const { types } = babel;
  const result = {
    injectMiDeclaration: false,
    uiComponents: [],
  };

  return {
    visitor: {
      Program: {
        enter() {
          result.injectMiDeclaration = false;
          result.uiComponents = [];
        },
        exit(path) {
          if (!result.injectMiDeclaration && !result.uiComponents.length) {
            return;
          }

          // 查找最后一个import的位置
          let lastImportIndex = -1;
          path.node.body.forEach((node, index) => {
            if (types.isImportDeclaration(node)) {
              lastImportIndex = index;
            }
          });

          insertContent({ path, types, index: lastImportIndex, name: 'mi', value: 'window.__miUitls' });
          result.uiComponents.forEach(({ oldName, newName }) => {
            insertContent({ path, types, index: lastImportIndex, name: newName, value: `window.__miUI.${oldName}` });
          });

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
        }
      },

      JSXElement(path) {
        const { node } = path;
        const openName = node.openingElement.name;
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
