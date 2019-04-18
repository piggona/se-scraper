const router = require('koa-router')();
const scraper = require('./scraper.js')

module.exports = (app) => {
    router.get('/api/search',async(ctx,next) => {
        keyword = ctx.request.query['keyword'];
        result = scraper(keyword);
        ctx.response.body = result;
    })
    app.use(router.routes()).use(router.allowedMethods())
}