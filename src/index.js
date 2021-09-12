// MODULES
import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
// COMPONENTS
import App from './components/app'
import moment from 'moment'
// CONSTANTS
const BTC_UUID = '1' // NW: this will change in v2 API available now
const API_VERSION = '1'
const PRICE_PERIOD = '30d'
// NW: See https://developers.coinranking.com/api/documentation for detailed docs
const API_URL = `https://api.coinranking.com/v${API_VERSION}/public/coin/${BTC_UUID}/history/${PRICE_PERIOD}`
const DIRECTION_SYMBOL_UP = 'Up';
const DIRECTION_SYMBOL_DOWN = 'Down';
const DIRECTION_SYMBOL_NO_CHANGE = 'Same'
const NA_SYMBOL = 'n/a'
// LOCAL VARS
let priceHistory = []
let formattedHistory = []
let firstRowSpecialCase = true


const calculatePriceChange = (previousPrice, currentPrice) => {
    let priceChange = NA_SYMBOL
    let trendDirection = NA_SYMBOL

    if (!firstRowSpecialCase) {
        // NW: rows 2-n
        priceChange = previousPrice - currentPrice;
        trendDirection = Math.sign(priceChange)
    }

    switch (trendDirection) {
        case 1:
            trendDirection = DIRECTION_SYMBOL_UP
            break
        case -1:
            trendDirection = DIRECTION_SYMBOL_DOWN;
            break
        case 0:
            trendDirection = DIRECTION_SYMBOL_NO_CHANGE
        default:
            trendDirection = '(No Data)'
            break
    }
    if (firstRowSpecialCase) {
        // NW: we handled the special first case, so unset the flag
        firstRowSpecialCase = false
    }

    return {
        change: priceChange,
        direction: trendDirection
    }

}

axios.get(API_URL)
    .then(function (response) {
        priceHistory = response.data.data.history

        // save only daily price at time "00:00:00"
        let priceHistoryDaily = []
        priceHistory.map(h => {
            let time = moment.utc(h.timestamp).format('HH:mm:ss')
            if (time == '00:00:00') {
                // NW: only save one price point per day at midnight time
                priceHistoryDaily.push(h)
            }
        })

        // format data into required format
        let prevPrice = 0
        let currPrice = 0
        priceHistoryDaily.forEach(h => {
            currPrice = h.price
            let { change, direction } = calculatePriceChange(prevPrice, currPrice)

            formattedHistory.push({
                date: moment.utc(h.timestamp).format(),
                price: h.price,
                direction,
                change,
                dayOfWeek: moment(h.timestamp).format('dddd')
            })
            // NW: save current as previous price for next iteration
            prevPrice = currPrice
        })
    })
    .catch(function (error) {
        console.log(error);
        throw new Error(error)
    })
    .then(function () {
        // render stuff
        ReactDOM.render(<App coin="Bitcoin" priceData={formattedHistory} />, document.getElementById('root'))
    });
