// MODULES
import React from 'react'
import moment from 'moment'


class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            coin: props.coin,
            priceData: props.priceData,
            previousPriceClick: 'n/a'
        }
    }

    handleRowClick(day) {
        // configure fake API request w/ query params
        const domain = 'http://example.com'
        const pathname = '/save_hits'
        const queryParams = `?priceDate=${day.date}&priceClick=${day.price}&previousPriceClick=${this.state.previousPriceClick}`

        // NW: In real-world, the domain would be a working API endpoint
        // Lets pretend like we are generating the endpoint URL, but only use it
        // as long as it's not 'example.com'
        let analyticsEndpoint = new URL(`${domain}${pathname}${queryParams}`)

        // NW: display URL we would have called if it actually was a working endpoint
        console.log('Row CLICKED! Fake Calling endpoint:')
        console.log(analyticsEndpoint.href)

        // TODO: Remove this when we have working test endpoint
        // START remove-codeblock
        if (domain === 'http://example.com') {
            // NW: use this fake data endpoint so we can demo a working app ;-)
            // Docs: https://jsonplaceholder.typicode.com/
            analyticsEndpoint = 'https://jsonplaceholder.typicode.com/todos/1'
        }
        // END /remove-codeblock

        fetch(analyticsEndpoint)
            .then(response => response.json())
            .then(json => {
                //console.log(json) // uncomment to show the response JSON from working fake API
            })
            .catch(error => console.log(error))
            .finally(() => {
                // NW: save selected row price to state for next row click
                this.state.previousPriceClick = day.price
            })
    }

    renderTableData(priceHistory) {
        return priceHistory.map((day, index) => {
            return (
                <tr key={index} onClick={(e) => this.handleRowClick(day)}>
                    <td>{moment.utc(day.date).format('M-DD-YYYY')}</td>
                    <td>{day.dayOfWeek}</td>
                    <td>₿ {day.price}</td>
                    <td>{day.change}</td>
                    <td>{day.direction} {(day.direction == 'Up') ? `🔥` : `😿`}</td>
                </tr>
            )
        })
    }

    render() {
        return (
            <div>
                <h1>🚀 {this.state.coin} Daily 30 Day Index🌛</h1>
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Price</th>
                            <th>24hr Change</th>
                            <th>Trend</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTableData(this.state.priceData)}
                    </tbody>
                </table>
            </div>
        )
    }
}




export default App
