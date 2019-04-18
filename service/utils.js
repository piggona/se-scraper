const request = require('request');

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

module.exports = get_proxy