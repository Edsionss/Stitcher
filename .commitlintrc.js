module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'perf',
        'ci'
      ]
    ],
    'subject-case': [0, 'always'],
    'header-max-length': [0, 'always', 100],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always']
  },
  prompt: {
    questions: {
      type: {
        description: '请选择提交类型',
        enum: {
          feat: {
            description: '新功能',
            title: 'Features',
            value: 'feat'
          },
          fix: {
            description: '修复bug',
            title: 'Bug Fixes',
            value: 'fix'
          },
          docs: {
            description: '文档更新',
            title: 'Documentation',
            value: 'docs'
          },
          style: {
            description: '代码格式化',
            title: 'Styles',
            value: 'style'
          },
          refactor: {
            description: '重构',
            title: 'Code Refactoring',
            value: 'refactor'
          },
          test: {
            description: '测试',
            title: 'Tests',
            value: 'test'
          },
          chore: {
            description: '构建/工具',
            title: 'Chore',
            value: 'chore'
          },
          perf: {
            description: '性能优化',
            title: 'Performance Improvements',
            value: 'perf'
          },
          ci: {
            description: 'CI/CD',
            title: 'Continuous Integrations',
            value: 'ci'
          }
        }
      },
      scope: {
        description: '请输入影响范围（可选）'
      },
      subject: {
        description: '请简洁描述提交'
      },
      body: {
        description: '请详细描述（可选）'
      },
      breaking: {
        description: '是否有破坏性变更？'
      },
      issues: {
        description: '关联Issue（可选），如: #123'
      }
    }
  }
}
