// MODULES
import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
// COMPONENTS
import App from './components/app.jsx'
import moment from 'moment'
// CUSTOM CONFIG
import { config } from './config.mjs'
const BTC_NAME = config.coin.name
// NW: See https://developers.coinranking.com/api/documentation for detailed docs
const API_URL = `https://api.coinranking.com/v${config.api.version}/public/coin/${config.coin.uuid}/history/${config.api.pricePeriod}`
const DIRECTION_SYMBOL_UP = 'Up'
const DIRECTION_SYMBOL_DOWN = 'Down'
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
    priceChange = previousPrice - currentPrice
    trendDirection = Math.sign(priceChange)
  }

  switch (trendDirection) {
    case 1:
      trendDirection = DIRECTION_SYMBOL_UP
      break
    case -1:
      trendDirection = DIRECTION_SYMBOL_DOWN
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
    direction: trendDirection,
  }
}

axios
  .get(API_URL)
  .then(function (response) {
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
      let { change, direction } = calculatePriceChange(prevPrice, currPrice)

      formattedHistory.push({
        date: moment.utc(day.timestamp).format(),
        price: day.price,
        direction,
        change,
        dayOfWeek: moment(day.timestamp).format('dddd'),
      })
      // NW: save current as previous price for next iteration
      prevPrice = currPrice
    })
  })
  .catch(function (error) {
    console.log(error)
    throw new Error(error)
  })
  .then(function () {
    // render stuff
    ReactDOM.render(
      <App coin={BTC_NAME} priceData={formattedHistory} />,
      document.getElementById('root')
    )
  })
