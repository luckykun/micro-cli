
const insertContent = ({ types, path, index, name, value = '' }) => {
  let valueDeclaration;
  const values = value.split('.');
  values.forEach((d, i) => {
    if (i === 0) return;
    if (i === 1) {
      valueDeclaration = types.memberExpression(types.identifier(values[0]), types.identifier(d));
    } else {
      valueDeclaration = types.memberExpression(valueDeclaration, types.identifier(d));
    }
  });
  const declaration = types.variableDeclarator(types.identifier(name), valueDeclaration); // UIButton = window.__miUI.Button
  const content = types.variableDeclaration('const', [declaration]);

  if (index === -1) { // 没有import语句，直接在最顶部添加
    path.unshiftContainer('body', content);
  } else { // 有import，则在import语句后添加
    path.get('body')[index].insertAfter(content);
  }
};


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
