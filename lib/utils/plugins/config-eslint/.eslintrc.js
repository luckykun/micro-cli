
module.exports = {
  extends: [
    'eslint-config-ali',
    'eslint-config-ali/react',
  ],
  globals: {
    React: true,
    ReactDOM: true,
    UI: true,
    mi: true,
  },
  plugins: [
    'react',
    'react-hooks',
    'sonarjs',
    'jsx-a11y',
    'import',
    'micro',
  ],
  rules: {
    // import 排序
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
    }],
    'import/no-unresolved': 0,

    // micro（自定义规则）
    'micro/short-function-name': 1,

    // react
    'react/jsx-key': 1,
    'react/jsx-indent': [1, 2],
    'react/jsx-indent-props': 2,
    'react/jsx-no-target-blank': 0, // 忽略 target 使用的警告
    'react/jsx-closing-tag-location': 0, // 不要想着标签严格缩进匹配
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }], // 只允许在JS/JSX出现JSX
    'react/no-unused-state': 2, // 不要出现没有使用的 state
    'react/prop-types': 0, // 关闭 prop-types
    'react/no-array-index-key': 0, // 允许使用数组索引
    'react/jsx-no-undef': [2, { allowGlobals: true }],
    'react/no-danger': 2,
    'react/display-name': 0,
    'react/no-deprecated': 1,
    'react/no-access-state-in-setstate': 1,

    // react hooks
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 0,

    // sonar 的 code smell detection
    'sonarjs/prefer-while': 1,
    'sonarjs/prefer-single-boolean-return': 1,
    'sonarjs/prefer-object-literal': 1,
    'sonarjs/no-inverted-boolean-check': 2,
    'sonarjs/no-redundant-boolean': 2,
    'sonarjs/no-identical-functions': 0,
    'sonarjs/no-duplicated-branches': 2,
    'sonarjs/no-useless-catch': 2,
    'sonarjs/prefer-immediate-return': 2,
    'sonarjs/no-small-switch': 2,
    'sonarjs/max-switch-cases': [2, 20],
    'sonarjs/cognitive-complexity': [1, 30],

    // other
    eqeqeq: 2,
    'no-script-url': 2, // 不允许 javascript:void(0) 的写法
    'no-unused-expressions': 0,
    'dot-notation': 0, // 获取对象属性不是必须用点
    'no-param-reassign': 0, // 允许复写参数
    'no-console': 1, // 警告 console.log 使用
    'no-plusplus': 0, // 允许自增操作
    'prefer-destructuring': 0, // 不要老想着解构
    semi: [1, 'always'], // 双引号
    'one-var': 0, // 不管你变量声明的方式了
    'arrow-parens': [0, 'always'], // 箭头函数参数应该始终包含括号
    indent: [1, 2, { SwitchCase: 1 }], // 2空格缩进，否则警告
    'no-unused-vars': 1, // 未使用的变量进行警告
    'arrow-body-style': [1, 'as-needed'], // 箭头函数可以去掉括号就去掉括号
    'max-len': 0, // 不限制单行长度
    'no-bitwise': 0, // 允许位运算
    radix: 0, // parseInt 不强制要求第二个参数
    'array-callback-return': 1, // 应该return的没有return的进行警告
    'no-restricted-globals': 2, // 不要直接使用 global 的东西
    'require-atomic-updates': 0,
    'no-nested-ternary': 1, // 不允许嵌套三元运算
  },
};
