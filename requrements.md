This is an API with the last 30 days by hour of bitcoin prices.

https://api.coinranking.com/v1/public/coin/1/history/30d

reading that API, display on a browser a formatted version:

{
    "date": "{date}",
    “price”: ”{value}",
    "direction": "{up/down/same}",
    "change": "{amount}",
    "dayOfWeek": "{name}”,
}

- date in format "2019-03-17T00:00:00"
- one entry per day at "00:00:00" hours
- results ordered by oldest date first.
- "direction" is direction of price change since previous day in the list, first day can be “na” ({up/down/same})
- "change" is the price difference between current and previous day. “na” for first
- "day of week" is name of the day (Saturday, Tuesday, etc)
 
- when you click on a row of data, it highlights that row, and sends a network request to:
http://www.example.com/save_hits?priceDate=<date>&priceClick=<price>&previousPriceClick=<previousPriceClick>
- <date> is the date/time of the row that was clicked on
- <price> is the price value of the row clicked
- <previousPriceClick> is the price of the previously clicked row. For the first click, this is "na"
 
It should be represented using some template like:
https://www.bootstrapdash.com/demo/stellar-admin-free/jquery/pages/tables/basic-table.html
(but doesn’t have to be this one, just some table template so its modular)

Must be a node project, checked into github that runs through NPM
