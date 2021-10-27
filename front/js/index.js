async function getItems() {
    try {
        const res = await fetch("http://localhost:3000/api/products");
        const items = await res.json();
        return items;
    }
    catch (err) {
        alert(err);
    };
}

function showItem(item) {
    document.querySelector("#items").innerHTML += `
        <a href="./product.html?id=${item._id}">
            <article>
                <img src="${item.imageUrl}" alt="${item.altTxt}">
                <h3 class="productName">${item.name}</h3>
                <p class="productDescription">${item.description}</p>
            </article>
        </a>`;
}

(async function renderProducts() {
    let items = await getItems()
    items.forEach(item => {
        showItem(item)
    });;
})()