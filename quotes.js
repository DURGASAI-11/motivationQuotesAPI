const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()
const PORT = process.env.PORT || 3000

const motivationLinks = [
  {
    address: 'https://teambuilding.com/blog/success-quotes',
    source: 'teambuilding',
  },
  {
    address: 'https://www.shopify.com/in/blog/motivational-quotes',
    source: 'shopify',
  },
  {
    address:
      'https://www.forbesindia.com/article/explainers/motivational-quotes/84853/1',
    source: 'forbesindia',
  },
  {
    address:
      'https://www.invajy.com/19-motivational-inspirational-quotes-for-success-in-life/',
    source: 'invajy',
  },
]

app.get('/moto', async (req, res) => {
  try {
    const quotes = await Promise.all(
      motivationLinks.map(async (motivationLink) => {
        try {
          const response = await axios.get(motivationLink.address)
          const html = response.data
          const $ = cheerio.load(html)

          const quoteElements = $('li') // Update this selector

          const quotesFromLink = quoteElements
            .map((index, element) => $(element).text().trim())
            .get()

          const filteredQuotes = quotesFromLink.filter((quote) =>
            quote.startsWith('“'),
          )

          const formattedQuotes = filteredQuotes.map((quote) => ({
            quote: quote,
            source: motivationLink.source,
          }))

          return formattedQuotes
        } catch (error) {
          console.error('Error:', error)
          return null
        }
      }),
    )
    res.json(quotes.filter((quote) => quote !== null))
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
