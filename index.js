/**
 *  Weather Request Module
 *
 *  @version 1.0.0
 *  @author Goma::NanoHa <goma@goma-gz.net>
*/
'use strict'

const request = require('superagent-promise')(require('superagent'), Promise)

require('dotenv'),config()

class Weather
{

    constructor(APPID)
    {
        this._APIKey = APPID
        this._endpointBase = 'http://api.openweathermap.org/data/2.5/forecast'
    }

}
