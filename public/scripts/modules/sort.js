const axios = require('axios')
const view = require('./view')

const sort = document.querySelector('#sort')

sort.addEventListener('change', async () => {
  const select = sort.value
  const response = await axios.post('/restaurant/sort', { select })
  view.displaySpinner()
  setTimeout(() => {
    view.renderCards(response.data)
  }, 300)
})
