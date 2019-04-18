const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser')
const router = require('./service/router.js')


app.use(async (ctx, next) => {
    console.log('Process ${ctx.request.method} ${ctx.request.url}...');
    await next();
})

app.use(bodyParser())

router(app)

app.listen(3000,()=>{
    console.log('server is running at http://localhost:3000')
});