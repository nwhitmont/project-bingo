// NW: Example usage of ES6 module as config object

const config = {
  coin: {
    name: 'Bitcoin',
    symbol: 'BTC',
    uuid: '1',
  },
  displayCurrency: 'USD',
  api: {
    version: '1',
    pricePeriod: '30d',
  },
}

export { config }
