// MODULES
import React from 'react'
import moment from 'moment'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      coin: props.coin,
      priceData: props.priceData,
      previousPriceClick: 'n/a',
      useTestJSON: true,
    }
  }

  buildEndpointURL(date, price, previousPriceClicked) {
    // configure fake API request w/ query params
    const domain = 'http://example.com'
    const pathname = '/save_hits'
    const queryParams = `?priceDate=${date}&priceClick=${price}&previousPriceClick=${previousPriceClicked}`

    // NW: In real-world, the domain would be a working API endpoint
    // Lets pretend like we are generating the endpoint URL, but only use it
    // as long as it's not 'example.com'
    return new URL(`${domain}${pathname}${queryParams}`)
  }

  handleRowClick(day) {
    let analyticsEndpoint = this.buildEndpointURL(
      day.date,
      day.price,
      this.state.previousPriceClick
    )

    // NW: display URL we would have called if it actually was a working endpoint
    console.log('Row CLICKED! Fake Calling endpoint:')
    console.log(analyticsEndpoint.href)
    alert(`Click would have called: ${analyticsEndpoint}`) // NW: remove for console only debug info

    // TODO: Remove this when we have working test endpoint
    // START remove-codeblock
    if (this.state.useTestJSON) {
      // NW: use this fake data endpoint so we can demo a working app ;-)
      // Docs: https://jsonplaceholder.typicode.com/
      analyticsEndpoint = 'https://jsonplaceholder.typicode.com/todos/1'
    }
    // END /remove-codeblock

    fetch(analyticsEndpoint)
      .then((response) => response.json())
      .then((json) => {
        //console.log(json) // uncomment to show the response JSON from working fake API
      })
      .catch((error) => console.log(error))
      .finally(() => {
        // NW: save selected row price to state for next row click
        this.state.previousPriceClick = day.price
      })
  }

  renderTableData(priceHistory) {
    return priceHistory.map((day, index) => {
      return (
        <tr key={index} onClick={(e) => this.handleRowClick(day)}>
          <td>{moment.utc(day.date).format()}</td>
          <td>{day.dayOfWeek}</td>
          <td>{day.price}</td>
          <td>{day.change}</td>
          <td>
            {day.direction == 'Up' ? `🔥` : `😿`} {day.direction}
          </td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div className="container">
        <h1>🚀 {this.state.coin} Daily 30 Day Index🌛</h1>
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Price (USD)</th>
              <th>24hr Change (USD)</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>{this.renderTableData(this.state.priceData)}</tbody>
        </table>
      </div>
    )
  }
}

export default App
