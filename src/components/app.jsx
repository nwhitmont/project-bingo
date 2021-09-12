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
      <div className="App container">
        <header className="App-header">
          <PageTitle coin={this.state.coin} />
        </header>
        <PriceTable coin={this.state.coin} priceData={this.state.priceData} />
      </div>
    )
  }
}

export default App
