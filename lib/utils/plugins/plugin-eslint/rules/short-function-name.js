'use strict';

const minNameLength = 6;

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '代码重构：避免过于简短的函数名称',
      recommended: true,
    },
  },

  create(context) {
    const showMessage = (node, name) => {
      context.report({
        node,
        message: `代码重构：避免过于简短的函数名称（建议${minNameLength - 1}个字符以上），请重新命名 ${name}`,
      });
    };

    return {
      FunctionDeclaration(node) {
        const { name } = node.id || {};
        if (name.length < minNameLength) {
          showMessage(node, name);
        }
      },
      VariableDeclarator(node) {
        const { name } = node.id || {};
        const { type } = node.init || {};
        if (['ArrowFunctionExpression', 'FunctionExpression'].includes(type) && (name.length < minNameLength)) {
          showMessage(node, name);
        }
      },
    };
  },
};
