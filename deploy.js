import FtpDeploy from 'ftp-deploy';
import config from './.ftpconfig.js';
import fs from 'fs';
import readline from 'readline';

// 检查dist目录是否存在
if (!fs.existsSync(config.localRoot)) {
  console.error(`错误: 本地目录 ${config.localRoot} 不存在，请先运行 npm run build`);
  process.exit(1);
}

// 创建readline接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 交互式输入密码
function askForPassword() {
  return new Promise((resolve) => {
    rl.question('请输入FTP密码: ', (password) => {
      resolve(password);
      rl.close();
    });
  });
}

// 执行部署
async function deploy() {
  try {
    console.log(`[${new Date().toLocaleTimeString()}] 开始部署到FTP服务器...`);
    console.log(`[${new Date().toLocaleTimeString()}] 目标服务器: ${config.host}:${config.port}`);
    console.log(`[${new Date().toLocaleTimeString()}] 本地目录: ${config.localRoot}`);
    console.log(`[${new Date().toLocaleTimeString()}] 远程目录: ${config.remoteRoot}`);
    
    // 输入密码
    const password = await askForPassword();
    
    // 创建ftpDeploy实例
    const ftpDeploy = new FtpDeploy();
    
    // 监听部署事件
    ftpDeploy.on('uploading', (data) => {
      console.log(`[${new Date().toLocaleTimeString()}] 上传中: ${data.filename} (${data.transferredFileCount}/${data.totalFileCount})`);
    });
    
    ftpDeploy.on('uploaded', (data) => {
      console.log(`[${new Date().toLocaleTimeString()}] 已上传: ${data.filename}`);
    });
    
    ftpDeploy.on('log', (data) => {
      console.log(`[${new Date().toLocaleTimeString()}] 日志: ${data}`);
    });
    
    ftpDeploy.on('error', (data) => {
      console.error(`[${new Date().toLocaleTimeString()}] 错误: ${data}`);
    });
    
    ftpDeploy.on('end', () => {
      console.log(`[${new Date().toLocaleTimeString()}] 部署完成！`);
    });
    
    console.log(`[${new Date().toLocaleTimeString()}] 开始连接FTP服务器...`);
    
    // 部署配置，包含密码
    const deployConfig = {
      ...config,
      password
    };
    
    // 执行部署
    await ftpDeploy.deploy(deployConfig);
    
    console.log(`[${new Date().toLocaleTimeString()}] 部署成功！`);
    console.log(`[${new Date().toLocaleTimeString()}] 所有文件已成功上传到FTP服务器`);
  } catch (err) {
    console.error(`[${new Date().toLocaleTimeString()}] 部署失败:`, err);
    console.error(`[${new Date().toLocaleTimeString()}] 可能的原因：`);
    console.error(`[${new Date().toLocaleTimeString()}] 1. 网络连接问题`);
    console.error(`[${new Date().toLocaleTimeString()}] 2. FTP服务器不可达`);
    console.error(`[${new Date().toLocaleTimeString()}] 3. FTP连接信息错误`);
    console.error(`[${new Date().toLocaleTimeString()}] 4. 防火墙限制`);
    process.exit(1);
  }
}

// 启动部署
deploy();
