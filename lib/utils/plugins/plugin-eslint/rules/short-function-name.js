
const minLenth = 5;

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce that function names are longer than 5 characters',
      category: 'Stylistic Issues',
      recommended: false,
    },
    schema: [], // No options
  },
  create(context) {
    return {
      FunctionDeclaration(node) {
        const functionName = node.id && node.id.name;

        if (functionName && functionName.length <= minLenth) {
          context.report({
            node,
            message: "Function name '{{ name }}' is too short.",
            data: {
              name: functionName,
            },
          });
        }
      },
    };
  },
};
