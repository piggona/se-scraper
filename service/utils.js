const request = require('request');

async function get_proxy() {
    let url = 'http://127.0.0.1:5010/get/';
    let option = {
        url: url,
        method: "GET"
    }
    request(option,function(error, response, body){
        if (!error && response.statusCode == 200){
            console.log(body)
            return Promise.resolve(body);
        }
        else{
            return Promise.reject(body);
        }
    })
}

module.exports = get_proxy