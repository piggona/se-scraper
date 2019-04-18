const request = require('request');

function synchronous_post(url) {
    let options = {
        url: url,
        method: "GET"
    }
    return new Promise(function(resolve, reject){
        request.get(options , function(error,response,body){
            if(error){
                reject(error);
            }else{
                resolve(body);
            }
        });
    });
}
let get_proxy = async function(){
    let url = 'http://127.0.0.1:5010/get/';
    let proxy = await synchronous_post(url);
    return Promise.resolve(proxy)
}

module.exports = get_proxy