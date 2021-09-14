import React from 'react'
import moment from 'moment'
const DISPLAY_CURRENCY = 'USD'

class PriceTable extends React.Component {
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

  renderPriceTable() {
    return (
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Date</th>
              <th scope="col"> Day</th>
              <th scope="col">Price {DISPLAY_CURRENCY}</th>
              <th scope="col">24hr Change {DISPLAY_CURRENCY}</th>
              <th scope="col">Trend</th>
            </tr>
          </thead>
          <tbody>{this.renderTableData(this.state.priceData)}</tbody>
        </table>
      </div>
    )
  }

  renderTableData(priceHistory) {
    return priceHistory.map((day, index) => {
      const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(day.price)
      const formattedChange = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(day.change)
      return (
        <tr
          key={index}
          className={day.direction == 'Up' ? 'table-success' : 'table-danger'} // example conditional highlight row
          onClick={(e) => this.handleRowClick(day)}
        >
          <td>{moment.utc(day.date).format()}</td>
          <td>{day.dayOfWeek}</td>
          <td>{formattedPrice}</td>
          <td>{formattedChange}</td>
          <td>
            {day.direction == 'Up' ? `🔥` : `😿`} {day.direction}
          </td>
        </tr>
      )
    })
  }

  render() {
    return this.renderPriceTable()
  }
}

export default PriceTable
