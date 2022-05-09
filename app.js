const Koa = require('koa');
const serve = require('koa-static')
const Router = require('@koa/router')
const path = require('path')
const { runDeploy } = require('./shell/index')
const PORT = 3000

const app = new Koa();
const router = new Router()

router.post("/deploy", async (ctx) => {
    try {
        let res = await runDeploy();
        if(res.status === 1){
            ctx.body = {
                code: 1,
                msg: res.message,
            };
        }
        ctx.body = {
            code: 0,
            msg: res.message,
        };
       
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: -1,
            msg: e.message,
        };
    }
});

app.use(serve(path.resolve(__dirname, "./static")))

app.use(router.routes())
    .use(router.allowedMethods())

app.listen(PORT, () => {
    console.log(`serve listen http://localhost:${PORT} 端口`)
})
