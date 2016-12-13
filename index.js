'use strict'
/**
 *  Weather Request Module
 *
 *  @version 1.0.0
 *  @author Goma::NanoHa <goma@goma-gz.net>
*/

const request = require('sync-req')

class WeatherReq
{

    constructor(KEY, config = {})
    {
        this._endpointBase = 'http://api.openweathermap.org/data/2.5/forecast/daily'
        this._APIKey = KEY
        this._lang = (this._empty(config.lang)) ? 'JP' : config.lang
        this._celsius = (this._empty(config.celsius)) ? true : config.celsius
        this._responce

        if(this._empty(this._APIKey)) {
            console.error('Empty APIKey. Exit 1')
            process.exit();
        }

    }

    get(zipCode = 0)
    {

        zipCode = this._checkZpiCode(zipCode)
        if(!zipCode) {
            return 'No ZIP Code';
        }

        let form = {
            zip: `${zipCode},${this._lang}`,
            cnt: 2,
            APPID: this._APIKey
        }

        let res = request('GET', `${this._endpointBase}?${this._createGetURL(form)}`)
        res = JSON.parse(res.body.toString('utf-8', 0, res.body.length))

        let Weather = {
            "weather": this._convertToWeather(res.list[1].weather[0].main),
            "temp": {
                "max": this._convertKtoCF(res.list[1].temp.max),
                "min": this._convertKtoCF(res.list[1].temp.min)
            }
        }

        return Weather

    }

    _convertToWeather(weather)
    {
        const main = require('./weather').main[weather]
        return (typeof main == 'undefined') ?
            (weather) :
            main

    }

    _convertKtoCF(kelvin)
    {
        return (this._celsius) ?
            (Math.floor((kelvin - 273.15) * 10) / 10 ) :
            (Math.floor((((kelvin - 273.15) * 1.8000) + 32.00) * 10) / 10)
    }

    _checkZpiCode(zipCode)
    {
        zipCode = (/([0-9]{7})/.test(zipCode)) ? zipCode.replace(/([0-9]{3})([0-9]{4})/g,`$1-$2`) : zipCode
        if(!/([0-9]{3})\-?([0-9]{4})/.test(zipCode)) {
            return false;
        }
        return zipCode
    }

    _createGetURL(obj)
    {
        let url = ""
        Object.keys(obj).forEach((key) => {
            url += `${key}=${obj[key]}&`
        }, obj)
        return url
    }

    _empty(text)
    {
        return (typeof text == 'undefined')? true : false
    }

}

module.exports = WeatherReq

