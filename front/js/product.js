function productCheck() {
    let url = new URL(window.location.href);
    let id = url.searchParams.get("id");
    return id;
}

async function productInfos() {
    let productId = productCheck();
    try {
        const res = await fetch(`http://localhost:3000/api/products/${productId}`);
        const item = await res.json();
        return item;
    }
    catch (err) {
        alert(err);
    };
}

(async function fillProduct() {
    let item = await productInfos();
    document.querySelector(".item__img").innerHTML =
        `<img src="${item.imageUrl}" alt="${item.altTxt}">`;
    document.querySelector("#title").innerHTML = item.name;
    document.querySelector("#price").innerHTML = item.price;
    document.querySelector("#description").innerHTML = item.description;
    item.colors.forEach(color => {
        document.querySelector("#colors").innerHTML +=
            `<option value="${color}">${color}</option>`
    });
})();

(function productStorage() {
    let sendButton = document.querySelector("#addToCart");
    sendButton.addEventListener("click", () => {
        let productId = productCheck();
        let productColor = document.querySelector("#colors").value;
        let productQuantity = document.querySelector("#quantity").value;
        let productDetails = {
            id: productId,
            color: productColor,
            quantity: productQuantity
        };
        let storageStatus = JSON.parse(localStorage.getItem("product"));
        let storagePush = () => {
            if (productColor === "") {
                alert("Veuillez sélectionner une couleur");
            }
            else if (productQuantity < 1 || productQuantity > 100) {
                alert("Veuillez choisir entre 1 et 100 articles");
            }
            else {
                storageStatus.push(productDetails);
                localStorage.setItem("product", JSON.stringify(storageStatus));
                alert("Votre sélection à été ajoutée au panier");
            }
        };
        if (storageStatus) {
            storageStatus.forEach((product, index) => {
                if (productDetails.id === product.id &&
                    productDetails.color === product.color) {
                    productDetails.quantity = parseInt(productDetails.quantity)
                        + parseInt(product.quantity);
                    storageStatus.splice(index, 1);
                }
            });
            storagePush();
        }
        else {
            storageStatus = [];
            storagePush();
        };
    });
})();