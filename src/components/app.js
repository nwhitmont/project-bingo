// MODULES
import React from 'react'
import moment from 'moment'
import PriceTable from './priceTable'
// CONST
const DISPLAY_CURRENCY = 'USD'

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
      <div className="container">
        <h1>🚀 {this.state.coin} Daily 30 Day Index🌛</h1>
        <br />
        <PriceTable coin={this.state.coin} priceData={this.state.priceData} />
      </div>
    )
  }
}

export default App
