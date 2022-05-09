const Koa = require('koa');
const serve = require('koa-static')
const Router = require('@koa/router')
const path = require('path')
const { runDeploy } = require('./shell/index')
const http = require('http')

const PORT = 3000
const app = new Koa()
const server = http.Server(app.callback())
const socketIo = require("socket.io")(server)
const router = new Router()
const socketList = []

socketIo.on("connection", (socket) => {
    let index = socketList.length
    socketList.push(socket)
    socket.on('disconnect', function(){
        console.log('断开连接')
        socketList.splice(index, 1)
        console.log(socketList.length, index)
    })
})

router.post("/deploy", async (ctx) => {
    try {
        let res = await runDeploy(socketIo);
        if (res.status === 1) {
            ctx.body = {
                code: 1,
                msg: res.message,
            }
        }
        ctx.body = {
            code: 0,
            msg: res.message,
        }

    } catch (e) {
        console.log(e)
        ctx.body = {
            code: -1,
            msg: e.message,
        }
    }
})

app.use(serve(path.resolve(__dirname, "./static")))
app.use(router.routes())
    .use(router.allowedMethods())

server.listen(PORT, () => {
    console.log(`serve listen http://localhost:${PORT}`)
})
