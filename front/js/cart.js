let storageStatus = JSON.parse(localStorage.getItem("product"));

(function cartCheck() {
    if (storageStatus === null || storageStatus == 0) {
        document.querySelector("#cart__items").innerHTML += `
            <article class="cart__item">
                <h2>Aucun produit</h2>   
                <p>Veuillez retourner sur la page d'accueil <br>
                    afin de sélectionner un produit.</p>
            </article>`;
    }
    else {
        cartDisplay();
    }
})();

async function cartDisplay() {
    storageStatus.forEach(async product => {
        await fetch(`http://localhost:3000/api/products/${product.id}`)
            .then(res => res.json())
            .then(item => {
                document.querySelector("#cart__items").innerHTML += `
                <article class="cart__item" data-id="{${product.id}}">
                    <div class="cart__item__img">
                        <img src="${item.imageUrl}" alt="${item.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__titlePrice">
                            <h2>${item.name}</h2>
                            <p>${product.color}</p>
                            <p>${item.price * product.quantity} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity"
                                    min="1" max="100" value="${product.quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article>`;
            });
        productQuantity();
        productRemoval();
        productsTotalAmount();
        productsTotalPrice();
    });
}

function productQuantity() {
    let quantitySelectors = document.querySelectorAll(".itemQuantity");
    for (let i = 0; i < quantitySelectors.length; i += 1) {
        quantitySelectors[i].addEventListener("change", () => {
            for (let j = 0; j < storageStatus.length; j += 1) {
                if (storageStatus[i].id === storageStatus[j].id &&
                    storageStatus[i].color === storageStatus[j].color) {
                    storageStatus[j].quantity = quantitySelectors[j].value;
                    localStorage.setItem("product", JSON.stringify(storageStatus));
                    location.reload();
                }
            };
        });
    };
}

function productRemoval() {
    let removeButtons = document.querySelectorAll(".deleteItem");
    for (let k = 0; k < removeButtons.length; k += 1) {
        removeButtons[k].addEventListener("click", () => {
            for (let l = 0; l < storageStatus.length; l += 1) {
                if (storageStatus[k].id === storageStatus[l].id &&
                    storageStatus[k].color === storageStatus[l].color) {
                    storageStatus.splice(l, 1);
                    localStorage.setItem("product", JSON.stringify(storageStatus));
                    location.reload();
                }
            };
        });
    };
}

function productsTotalAmount() {
    let amountDisplay = document.querySelector("#totalQuantity");
    let productsAmount = [];
    storageStatus.forEach(product => {
        let totalProducts = parseInt(product.quantity);
        productsAmount.push(totalProducts);
        let reducer = (accumulator, currentValue) => accumulator + currentValue;
        amountDisplay.textContent = productsAmount.reduce(reducer, 0);
    });
}

async function productsTotalPrice() {
    let priceDisplay = document.querySelector("#totalPrice");
    let productsPrice = [];
    storageStatus.forEach(async product => {
        await fetch(`http://localhost:3000/api/products/${product.id}`)
            .then(res => res.json())
            .then(item => {
                let totalPrice = product.quantity * item.price;
                productsPrice.push(totalPrice);
                let reducer = (accumulator, currentValue) => accumulator + currentValue;
                priceDisplay.textContent = productsPrice.reduce(reducer, 0);
            });
    });
}