'use strict'
/**
 *  Weather Request Module
 *
 *  @version 1.0.0
 *  @author Goma::NanoHa <goma@goma-gz.net>
*/

const request = require('sync-req')

class Weather
{

    constructor(APPID, lang = 'ja', celsius = true)
    {
        this._APIKey = APPID
        this._endpointBase = 'http://api.openweathermap.org/data/2.5/forecast/daily'
        this._lang = lang
        this._celsius = celsius
        this._responce
    }

    get(zipCode = 0)
    {

        zipCode = this._checkZpiCode(zipCode)
        if(!zipCode) {
            return false;
        }

        let form = {
            zip: `${zipCode},JP`,
            cnt: 2,
            lang: 'ja',
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

}

module.exports = Weather

