const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const se_scraper = require('./index.js');
const request = require('request');

let config = {
    // the user agent to scrape with
    // user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
    // if random_user_agent is set to True, a random user agent is chosen
    random_user_agent: true,
    // how long to sleep between requests. a random sleep interval within the range [a,b]
    // is drawn before every request. empty string for no sleeping.
    sleep_range: '[1,2]',
    // which search engine to scrape
    search_engine: 'baidu',
    // whether debug information should be printed
    // debug info is useful for developers when debugging
    debug: false,
    // whether verbose program output should be printed
    // this output is informational
    verbose: true,
    // an array of keywords to scrape
    keywords: ['face replacement'],
    // alternatively you can specify a keyword_file. this overwrites the keywords array
    keyword_file: '',
    // the number of pages to scrape for each keyword
    num_pages: 3,
    // whether to start the browser in headless mode
    headless: false,
    // path to output file, data will be stored in JSON
    output_file: '/root/hao-scrape/examples/results/google.json',
    // whether to prevent images, css, fonts from being loaded
    // will speed up scraping a great deal
    block_assets: false,
    // path to js module that extends functionality
    // this module should export the functions:
    // get_browser, handle_metadata, close_browser
    // must be an absolute path to the module
    //custom_func: resolve('examples/pluggable.js'),
    custom_func: '/root/hao-scrape/examples/pluggable.js',
    // use a proxy for all connections
    // example: 'socks5://78.94.172.42:1080'
    // example: 'http://118.174.233.10:48400'
    proxy: '',
    // a file with one proxy per line. Example:
    // socks5://78.94.172.42:1080
    // http://118.174.233.10:48400
    proxy_file: '',
    // check if headless chrome escapes common detection techniques
    // this is a quick test and should be used for debugging
    test_evasion: false,
    apply_evasion_techniques: true,
    // log ip address data
    log_ip_address: false,
    // log http headers
    log_http_headers: false,
    puppeteer_cluster_config: {
        timeout: 10 * 60 * 1000, // max timeout set to 10 minutes
        monitor: false,
        concurrency: 1, // one scraper per tab
        maxConcurrency: 1, // scrape with 2 tabs
    }
};

function get_proxy() {
    return new Promise((resolve, reject) => {
        let url = 'http://127.0.0.1:5010/get/';
        let option = {
            url: url,
            method: "GET"
        }
        request(option,function(error, response, body){
            if (!error && response.statusCode == 200){
                resolve(body);
            }
        })
    })
}

function callback(err, response) {
    if (err) { console.error(err) }

    /* response object has the following properties:

        response.results - json object with the scraping results
        response.metadata - json object with metadata information
        response.statusCode - status code of the scraping process
     */

    console.dir(response.results, {depth: null, colors: true});
}

app.use(async (ctx, next) => {
    console.log('Process ${ctx.request.method} ${ctx.request.url}...');
    await next();
})
router.get('/search',async(ctx,next) => {
    let keyword = [];
    let query = ctx.request.query['name'];
    keyword.push(query);
    console.log(keyword)
    config['keywords'] = keyword;

    let proxy = ''
    get_proxy().then(function(req){
        proxy = 'http://'+req;
        console.log('http://'+proxy);
        config['proxy'] = proxy;
    })
    let result = await se_scraper.scrape(config, callback);
    ctx.response.body = result
    
})

router.get('/:name/:race', async(ctx,next) => {
    console.log(ctx.params);
    console.log(ctx.request.query)
    ctx.response.status =404;
    ctx.response.body = ctx.request.query;
})

app.use(router.routes())

app.listen(3000,()=>{
    console.log('server is running at http://localhost:3000')
});