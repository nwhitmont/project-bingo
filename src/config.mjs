// NW: Example usage of ES6 module as config object

const trend = new Map([
  [1, 'Up'],
  [-1, 'Down'],
  [0, 'Same'],
  [NaN, '(No Data)'],
])

const config = {
  coin: {
    name: 'Bitcoin',
    symbol: 'BTC',
    uuid: '1',
  },
  displayCurrency: 'USD',
  api: {
    version: '2',
    pricePeriod: '30d',
  },
  trend,
}

export { config }
