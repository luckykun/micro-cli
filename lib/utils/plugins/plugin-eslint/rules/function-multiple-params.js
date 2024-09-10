const ruleInfo = {
  name: 'avoidMultipleParams',
  message: '多个参数需合并为一个对象',
  startAt: ['FunctionDeclaration', 'ArrowFunctionExpression', 'FunctionExpression'],
};

module.exports = {
  meta: {
    type: 'problem',
  },
  create(context) {
    const option = context.options[0];
    let numParams = 3;

    if (typeof option === 'object' && Object.prototype.hasOwnProperty.call(option, 'max')) {
      numParams = option.max;
    }
    if (typeof option === 'number') {
      numParams = option;
    }

    const callbackFunctions = {};

    ruleInfo.startAt.forEach((name) => {
      callbackFunctions[name] = (node) => {
        if (node.params.length > numParams) {
          context.report({
            node,
            message: `${ruleInfo.message}: 最多允许参数个数为 {{ max }} 个，此函数有 {{ count }} 个参数`,
            data: {
              count: node.params.length,
              max: numParams,
            },
          });
        }
      };
    });
    return callbackFunctions;
  },
};

