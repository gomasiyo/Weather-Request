'use strict'

const weatherReq = require('..')

require('dotenv').config()

const weather = new weatherReq(
    process.env.APPKEY,
    {
        lang: 'JP',
        celsius: true
    }
)

console.log(weather.get(process.env.ZIPCODE))
