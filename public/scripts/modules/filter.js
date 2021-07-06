const axios = require('axios')
const view = require('./view')

const filterContainer = document.querySelector('#filterContainer')

filterContainer.addEventListener('change', async () => {
  const selectedCategoriesRaw = document.querySelectorAll('#filterContainer input:checked')
  const selected = []
  selectedCategoriesRaw.forEach(node => selected.push(node.value))

  const payload = { selected }
  const response = await axios.post('/restaurant/filter', {
    url: '/restaurant/filter',
    method: 'post',
    data: payload
  })
  view.displaySpinner()
  setTimeout(() => {
    view.renderCards(response.data)
  }, 300)
})
