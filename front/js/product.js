function productCheck() {
    let url = new URL(window.location)
    let id = url.searchParams.get("id")
    return id
}

async function productInfos() {
    let productId = productCheck()
    let res = await fetch(`http://localhost:3000/api/products/${productId}`)
    return res.json()
}

async function fillProduct() {
    let item = await productInfos()
    document
        .querySelector(".item__img")
        .innerHTML += `<img src="${item.imageUrl}" alt="${item.altTxt}">`
    document
        .getElementById("title")
        .innerHTML += item.name
    document
        .getElementById("price")
        .innerHTML += item.price
    document
        .getElementById("description")
        .innerHTML += item.description
    item.colors.forEach(color => {
        document
            .getElementById("colors")
            .innerHTML += `<option value="${color}">${color}</option>`
    })
}

fillProduct()