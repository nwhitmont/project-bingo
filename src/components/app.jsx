// MODULES
import React from 'react'
import moment from 'moment'
// COMPONENTS
import PriceTable from './priceTable'
import PageTitle from './pageTitle'

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
      <div className="container">
        <PageTitle coin={this.state.coin} />
        <br />
        <PriceTable coin={this.state.coin} priceData={this.state.priceData} />
      </div>
    )
  }
}

export default App
