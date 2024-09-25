/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true, // 使用单引号
        semi: false, // 结尾不使用分号
        printWidth: 100, // 单行最大长度
        trailingComma: 'none', // 结尾不使用逗号
        endOfLine: 'auto' // 自动根据操作系统换行(win和mac不一致)
      }
    ],
    'vue/multi-word-component-names': [
      'warn',
      {
        ignores: ['index'] // 忽略 index.vue 文件名必须为多词的规则
      }
    ],
    'vue/no-setup-props-destructure': ['off'], // 允许解构 setup 函数中的 props
    // 添加未定义变量错误提示，create-vue@3.6.3 关闭
    'no-undef': 'error'
  },
  globals: {
    ElMessage: 'readonly',
    ElMessageBox: 'readonly',
    ElLoading: 'readonly',
    ElNotification: 'readonly'
  }
}
