
exports.insertContent = ({ types, path, index, name, value = '' }) => {
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
