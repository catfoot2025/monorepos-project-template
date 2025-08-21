import { execSync } from 'child_process'
import fg from 'fast-glob'

// 以同步方式获取指定目录下所有的目录，扁平化后，以数组的形式返回
// ['src/alarm', 'src/device']
const getPackages = (packagePath) =>
  fg.sync('*', { cwd: packagePath, onlyDirectories: true })

console.log(getPackages('.'))

const scopes = [
  ...getPackages('packages'),
  ...getPackages('internal'),
  'docs',
  'play',
  'project',
  'core',
  'style',
  'ci',
  'dev',
  'deploy',
  'other',
  'typography',
  'color',
  'border',
  'var',
  'ssr',
  'types',
  'deps',
]

// execSync同步执行 shell 命令的方法
// Git 命令，用于获取仓库状态的机器可读格式**​（Porcelain Format）。
// 与常规 git status 相比，其输出更结构化（如用 M 表示修改、A 表示新增、?? 表示未跟踪等），适合脚本解析。
const gitStatus = execSync('git status --porcelain || true')
  // 将返回的Buffer格式转换为string
  .toString()
  // 去除掉首尾的空白字符，包括空格、tab、换行符\n等
  .trim()
  // 将字符串按换行符分割成数组
  .split('\n')
console.log(gitStatus)

const scopeComplete = gitStatus
  .find((r) => ~r.indexOf('M  packages'))
  ?.replace(/\//g, '%%')
  ?.match(/packages%%((\w|-)*)/)?.[1]

const subjectComplete = gitStatus
  .find((r) => ~r.indexOf('M  packages/components'))
  ?.replace(/\//g, '%%')
  ?.match(/packages%%components%%((\w|-)*)/)?.[1]

/** @type { import('cz-git').UserConfig } */
export default {
  extends: '@commitlint/config-conventional',
  rules: {
    /**
     * type[scope]: [function] description
     *      ^^^^^
     */
    'scope-enum': [2, 'always', scopes],
    /**
     * type[scope]: [function] description
     *
     * ^^^^^^^^^^^^^^ empty line.
     * - Something here
     */
    'body-leading-blank': [1, 'always'],
    /**
     * type[scope]: [function] description
     *
     * - something here
     *
     * ^^^^^^^^^^^^^^
     */
    'footer-leading-blank': [1, 'always'],
    /**
     * type[scope]: [function] description [No more than 72 characters]
     *      ^^^^^
     */
    'header-max-length': [2, 'always', 72],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [
      1,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    /**
     * type[scope]: [function] description
     * ^^^^
     */
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'release',
        'style',
        'test',
        'improvement',
      ],
    ],
  },
  prompt: {
    defaultScope: scopeComplete,
    customScopesAlign: !scopeComplete ? 'top' : 'bottom',
    defaultSubject: subjectComplete && `[${subjectComplete}] `,
    allowCustomIssuePrefixs: false,
    allowEmptyIssuePrefixs: false,
  },
}
