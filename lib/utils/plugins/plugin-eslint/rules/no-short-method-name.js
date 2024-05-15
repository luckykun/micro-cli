'use strict';

const MinNameLength = 6;

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '代码重构：避免简短的函数名称 ',
    },
    messages: {
      avoidShortName: `代码重构：避免过于简短的函数名称（建议${MinNameLength - 1}个字符以上），请重新命名 {{name}}`,
    },
  },
  create(context) {
    return {
      MethodDefinition(node) {
        const funName = node.key.name || '';
        if (funName.length < MinNameLength) {
          context.report({
            messageId: 'avoidShortName',
            node,
            data: {
              name: funName,
            },
          });
        }
      },
    };
  },
};
