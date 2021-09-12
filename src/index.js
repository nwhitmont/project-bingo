// MODULES
import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
// COMPONENTS
import App from './components/app'
import moment from 'moment'
// CONSTANTS
const BTC_UUID = '1'
const API_VERSION = '1'
const PRICE_PERIOD = '30d'
// NW: See https://developers.coinranking.com/api/documentation for detailed docs
const API_URL = `https://api.coinranking.com/v${API_VERSION}/public/coin/${BTC_UUID}/history/${PRICE_PERIOD}`
const DIRECTION_SYMBOL_UP = 'Up';
const DIRECTION_SYMBOL_DOWN = 'Down';
const DIRECTION_SYMBOL_NO_CHANGE = 'Same'
// LOCAL VARS
let priceHistory = []
let formattedHistory = []


// const BTC_UUID_V2 = 'Qwsogvtv82FCd'

const calculatePriceChange = (previousPrice, currentPrice) => {
    // console.log('calculating price change with data:')
    // console.log('Previous: ', previousPrice)
    // console.log('Current: ', currentPrice)

    const change = previousPrice - currentPrice;
    // console.log('found change: ', change)

    let direction = Math.sign(change)
    // console.log('found direction: ', direction)

    switch (direction) {
        case 1:
            direction = DIRECTION_SYMBOL_UP
            break
        case -1:
            direction = DIRECTION_SYMBOL_DOWN;
            break
        default:
            direction = DIRECTION_SYMBOL_NO_CHANGE;
            break
    }
    // console.log('mapped direction to symbol: ', direction)

    return {
        change,
        direction
    }

}

axios.get(API_URL)
    .then(function (response) {

        priceHistory = response.data.data.history
        // console.log('Data before formatting:')
        // console.log(priceHistory);

        // save only daily price at time "00:00:00"
        let priceHistoryDaily = []
        priceHistory.map(h => {
            let time = moment.utc(h.timestamp).format('HH:mm:ss')
            // console.log('Checking timestamp for TIME: ', time)
            if (time == '00:00:00') {
                // console.log('Saving to DAILY HISTORY: ', moment.utc(h.timestamp))
                // NW: only save one price point per day at midnight time
                priceHistoryDaily.push(h)
            }
        })

        // console.log('Price history filtered to daily 00:00:00')
        // console.log(priceHistoryDaily)

        // format data into required format
        let prevPrice = 0
        let currPrice = 0
        priceHistoryDaily.forEach(h => {
            currPrice = h.price
            let { change, direction } = calculatePriceChange(prevPrice, currPrice)

            // console.log('change: ', change)
            // console.log('direction: ', direction)

            formattedHistory.push({
                date: moment.utc(h.timestamp).format(),
                price: h.price,
                direction,
                change,
                dayOfWeek: moment(h.timestamp).format('dddd')
            })

            prevPrice = currPrice
        })

        console.log('Finished formatting price data:')
        console.log(formattedHistory)
    })
    .catch(function (error) {
        console.log(error);
        throw new Error(error)
    })
    .then(function () {
        // render stuff
        ReactDOM.render(<App coin="Bitcoin" priceData={formattedHistory} />, document.getElementById('root'))
    });
