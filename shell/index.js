const { spawn } = require('child_process');

function runDeploy(socketIo) {
    let status = 0
    return new Promise((resolve, reject) => {
        if(status === 1) {
            resolve({
                status,
                message: '正在部署中'
            })
            return
        }
        status = 1
        // 执行对应的 shell 命令部署
        // const child = spawn('sh', ['shell/deploy-a.sh']) 打包 page-a 部署
        const child = spawn('sh', ['shell/deploy.sh'])
        let msg = ''
        // shell 日志信息
        child.stdout.on('data', (data) => {
            socketIo.emit('deploy-log', `${data}`)
            msg += data
            console.log(`stdout: ${data}`);
        })
        // shell 执行完毕
        child.stdout.on('end', () => {
            status = 0
            resolve({
                status,
                message: msg
            })
        })
        // 如果发生错误，错误从这里输出
        child.stderr.on('data', (data) => {
            status = 0
            socketIo.emit('deploy-log', `${data}`)
            console.error(`stderr: ${data}`)
            reject(new Error(data))
        })

        child.on('close', (code) => {
            // 执行完成后正常退出就是 0 
            console.log(`child process exited with code ${code}`);
            status = 0
        })
    })
}
module.exports = {
    runDeploy
}