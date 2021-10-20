function getItems() {
    return fetch("http://localhost:3000/api/products")
        .then(function (res) {
            return res.json()
        })
        .then(function (items) {
            return items
        })
        .catch(function (err) {
            alert(err)
        })
}

function showItem() {
    document
        .getElementById("items")
        .innerHTML += `
        <a href="./product.html?id=${item._id}">
            <article>
                <img src="${item.imageUrl}" alt="${item.altTxt}">
                <h3 class="productName">${item.name}</h3>
                <p class="productDescription">${item.description}</p>
            </article>
        </a>`
}

async function renderProducts() {
    let items = await getItems()
    for (item of items) {
        showItem(item)
    }
}

renderProducts()