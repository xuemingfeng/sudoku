export default {
  // FTP连接信息
  host: '47.105.57.20',
  port: 21,
  user: 'sudoku',
  // 密码将在执行时交互式输入
  
  // 部署选项
  localRoot: './dist',
  remoteRoot: '/',
  include: ['*', '**/*'],
  exclude: [
    'node_modules/**',
    '.git/**',
    '.DS_Store',
    'Thumbs.db'
  ],
  deleteRemote: false,
  forcePasv: true
};