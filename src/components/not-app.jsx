// MODULES
import React from 'react'
// COMPONENTS
import PriceTable from './PriceTable'
import PageTitle from './PageTitle'
// CSS
import './App.css'
// LOCAL VARS
const API_DOCS_URL = 'https://developers.coinranking.com/api/documentation'

// example class component
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      coin: props.coin,
      priceData: props.priceData,
    }
  }
  render() {
    return (
      <div className="App container">
        <header className="App-header">
          <PageTitle coin={this.state.coin} />
        </header>
        <div className="App-info">
          <img
            className="App-btc-logo"
            src="https://cdn.coinranking.com/Sy33Krudb/btc.png"
          />
        </div>
        <PriceTable coin={this.state.coin} priceData={this.state.priceData} />
        <div className="alert alert-info" role="alert">
          Bitcoin price data and logo sourced from{' '}
          <a href={API_DOCS_URL} target="_blank">
            Coinranking API
          </a>
        </div>
      </div>
    )
  }
}

export default App
