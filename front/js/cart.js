function getCart() {
    return JSON.parse(localStorage.getItem("product"));
}

function cartCheck() {
    const storageStatus = getCart();
    if (storageStatus === null || storageStatus.length === 0) {
        document.querySelector("#cart__items").innerHTML = `
            <article class="cart__item">
                <h2>Aucun produit</h2>   
                <p>Veuillez retourner sur la page d'accueil <br>
                    afin de sélectionner un produit.</p>
            </article>`;
        document.querySelector('#totalQuantity').innerHTML = 0;
        document.querySelector('#totalPrice').innerHTML = 0;
        return false;
    }
    else {
        return true;
    }
}

async function cartDisplay() {
    const storageStatus = getCart();
    let totalPrice = 0;
    let totalQty = 0;
    let cartContent = '';
    for (product of storageStatus) {
        await fetch(`http://localhost:3000/api/products/${product.id}`)
            .then(res => res.json())
            .then(item => {
                totalPrice += parseInt(item.price) * parseInt(product.quantity);
                totalQty += parseInt(product.quantity);
                cartContent += `
                <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
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
    };
    document.querySelector("#cart__items").innerHTML = cartContent;
    document.querySelector('#totalQuantity').innerHTML = totalQty;
    document.querySelector('#totalPrice').innerHTML = totalPrice;
}

(async function loadPage() {
    if (cartCheck()) {
        await cartDisplay();
        productQuantity();
        productRemoval();
    }
})();

function productQuantity() {
    const storageStatus = getCart();
    let quantitySelectors = document.querySelectorAll(".itemQuantity");
    quantitySelectors.forEach(qtyInput => {
        qtyInput.addEventListener('change', (event) => {
            const newQty = event.target.value;
            const productId = event.target.closest('article').dataset.id;
            const productColor = event.target.closest('article').dataset.color;
            const productCartPosition = storageStatus.findIndex(item =>
                item.id === productId && item.color === productColor);
            storageStatus[productCartPosition].quantity = newQty;
            localStorage.setItem("product", JSON.stringify(storageStatus));
            loadPage();
        });
    });
}

function productRemoval() {
    const storageStatus = getCart();
    let removeButtons = document.querySelectorAll(".deleteItem");
    removeButtons.forEach(removeButton => {
        removeButton.addEventListener('click', (event) => {
            const productId = event.target.closest('article').dataset.id;
            const productColor = event.target.closest('article').dataset.color;
            const newCart = storageStatus.filter(item =>
                !(item.id == productId && item.color === productColor));
            localStorage.setItem("product", JSON.stringify(newCart));
            loadPage();
        })
    });
}

function formValidation() {
    let firstNameCheck = () => {
        let firstName = document.querySelector("#firstName");
        let errorMsg = document.querySelector("#firstNameErrorMsg");
        if (/^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(firstName.value)) {
            errorMsg.innerText = "";
            return true;
        }
        else {
            errorMsg.innerText = "Veuillez renseigner un prénom.";
        }
    };
    let lastNameCheck = () => {
        let lastName = document.querySelector("#lastName");
        let errorMsg = document.querySelector("#lastNameErrorMsg");
        if (/^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(lastName.value)) {
            errorMsg.innerText = "";
            return true;
        }
        else {
            errorMsg.innerText = "Veuillez renseigner un nom.";
        }
    };
    let addressCheck = () => {
        let address = document.querySelector("#address");
        let errorMsg = document.querySelector("#addressErrorMsg");
        if (/[^§]{5,50}$/.test(address.value)) {
            errorMsg.innerText = "";
            return true;
        }
        else {
            errorMsg.innerText = "Veuillez renseigner une adresse.";
        }
    };
    let cityCheck = () => {
        let city = document.querySelector("#city");
        let errorMsg = document.querySelector("#cityErrorMsg");
        if (/^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(city.value)) {
            errorMsg.innerText = "";
            return true;
        }
        else {
            errorMsg.innerText = "Veuillez renseigner une ville.";
        }
    };
    let emailCheck = () => {
        let email = document.querySelector("#email");
        let errorMsg = document.querySelector("#emailErrorMsg");
        if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value)) {
            errorMsg.innerText = "";
            return true;
        }
        else {
            errorMsg.innerText = "Veuillez renseigner un email.";
        }
    };
    if (firstNameCheck() &&
        lastNameCheck() &&
        addressCheck() &&
        cityCheck() &&
        emailCheck()) {
        return true;
    }
    else {
        console.log("Formulaire invalide.");
    }
}

(async function orderSending() {
    let storageStatus = getCart();
    let orderButton = document.querySelector("#order");
    orderButton.addEventListener("click", async () => {
        if (formValidation()) {
            let contact = {
                firstName: document.querySelector("#firstName").value,
                lastName: document.querySelector("#lastName").value,
                address: document.querySelector("#address").value,
                city: document.querySelector("#city").value,
                email: document.querySelector("#email").value
            };
            console.log(contact);
            let products = [];
            storageStatus.forEach(product => {
                products.push(product.id)
            });
            console.log(products)
            let userData = {
                contact,
                products
            };
            console.log(userData);
            await fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })
                .then(res => res.json())
                .then(data => {
                    location.href = `./confirmation.html?id=${data.orderId}`;
                })
                .catch(error => {
                    console.log("Erreur: " + error);
                });
        }
        else {
            alert("Veuillez verifier vos informations.");
        }
    });
})();