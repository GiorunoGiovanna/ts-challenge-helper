const axios = require('axios');

exports.allSettled = (promises) => {
    return Promise.allSettled(promises)
}