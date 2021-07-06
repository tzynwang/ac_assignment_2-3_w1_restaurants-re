const cardsContainer = document.querySelector('#cardsContainer')

function displaySpinner () {
  cardsContainer.innerHTML = `
  <div class="d-flex justify-content-center w-100 mt-5">
    <div class="spinner-grow text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  `
}

function renderCards (array) {
  cardsContainer.innerHTML = ''
  array.forEach(item => {
    const src = item.image_url ? item.image_url : `data:image${item.image.contentType};base64,${item.image.data}`

    cardsContainer.innerHTML += `
    <div class="col">
      <div class="card">
        <div class="card-image">
          <a href="/restaurant/${item._id}" class="text-decoration-none">
            <img src="${src}" class="card-img-top" alt="restaurant image">
          </a>
        </div>
        <div class="card-body">
          <a href="/restaurant/${item._id}" class="card-title h5 text-decoration-none d-block">${item.name}</a>
          <span class="badge bg-info">${item.category}</span>
          <span class="badge bg-warning text-dark"><i class="bi bi-star-fill me-1"></i>${item.rating}</span>
          <a href="/restaurant/${item._id}/edit" class="badge bg-secondary text-decoration-none">
            <i class="bi bi-pencil-square"></i>
          </a>
          <a type="button" class="badge bg-light text-decoration-none"
          data-bs-toggle="modal" data-bs-target="#modal${item._id}">
            <i class="bi bi-trash-fill"></i>
          </a>
        </div>
      </div>
      <div class="mt-1 d-flex align-items-center justify-content-end">
        <a href="/restaurant/${item._id}/edit" class="text-decoration-none me-2">
          <i class="bi bi-pencil-square"></i> 編輯
        </a>
        <a href="/restaurant/${item._id}" class="text-decoration-none me-2">
          <i class="bi bi-search"></i> 詳細
        </a>
        <a type="button" class="text-decoration-none btn btn-light" data-bs-toggle="modal" data-bs-target="#modal${item._id}">
          <i class="bi bi-trash-fill"></i> 刪除
        </a>
      </div>
    </div>

    <div class="modal fade" id="modal${item._id}" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <p class="modal-title h5">${item.name}</p>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            確認要刪除餐廳「${item.name}」嗎？
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">取消</button>
            <form action="/restaurant/${item._id}?_method=DELETE" method="POST">
              <button type="submit" class="btn btn-secondary">確認刪除</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    `
  })
}

module.exports = { displaySpinner, renderCards }
