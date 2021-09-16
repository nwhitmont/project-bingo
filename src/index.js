// MODULES
import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
// COMPONENTS
import App from './components/App.jsx'
import moment from 'moment'
// CUSTOM CONFIG
import { config } from './config.mjs'
const BTC_NAME = config.coin.name
// NW: See https://developers.coinranking.com/api/documentation for detailed docs
const API_URL = `https://api.coinranking.com/v${config.api.version}/public/coin/${config.coin.uuid}/history/${config.api.pricePeriod}`
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
    priceChange = currentPrice - previousPrice
    // NW: a switch statement into a one-liner with the help of Map()
    trendDirection = config.trend.get(Math.sign(priceChange))
  }
  if (firstRowSpecialCase) {
    // NW: we handled the special first case, so unset the flag
    firstRowSpecialCase = false
  }
  return {
    change: priceChange,
    direction: trendDirection,
  }
}
axios
  .get(API_URL)
  .then((response) => {
    priceHistory = response.data.data.history
    // save only daily price at time "00:00:00"
    let priceHistoryDaily = []
    priceHistory.map((h) => {
      let time = moment.utc(h.timestamp).format('HH:mm:ss')
      if (time == '00:00:00') {
        // NW: only save one price point per day at midnight time
        priceHistoryDaily.push(h)
      }
    })
    // format data into required format
    let prevPrice = 0
    let currPrice = 0
    priceHistoryDaily.forEach((day) => {
      currPrice = day.price
      // NW: example ES6 destructuring assignment
      let { change, direction } = calculatePriceChange(prevPrice, currPrice)
      // NW: save only required data in specified format
      formattedHistory.push({
        date: moment(day.timestamp).format('L'),
        price: day.price,
        direction,
        change,
        dayOfWeek: moment(day.timestamp).format('dddd'),
      })
      // NW: save current as previous price for next iteration
      prevPrice = currPrice
    })
  })
  .catch((error) => {
    // NW: Prepare for failure and ensure detailed log info
    console.log(error)
    throw new Error(error)
  })
  .then(() => {
    // render stuff
    ReactDOM.render(
      <App coin={BTC_NAME} priceData={formattedHistory} />,
      document.getElementById('root')
    )
  })
