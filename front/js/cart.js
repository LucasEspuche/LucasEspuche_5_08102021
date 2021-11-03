(function displayCart() {
    let storageStatus = JSON.parse(localStorage.getItem("product"));
    if (storageStatus === null) {
        document.querySelector("#cart__items").innerHTML += `
            <article class="cart__item">
                <h2>Aucun produit</h2>   
                <p>Veuillez retourner sur la page d'accueil <br>
                    afin de sélectionner un produit.</p>
            </article>`;
    }
    else {
        storageStatus.forEach(product => {
            fetch(`http://localhost:3000/api/products/${product.id}`)
                .then(function (res) {
                    return res.json();
                })
                .then(function (item) {
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
        });
    }
})();