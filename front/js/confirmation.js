// Récupération de l'ID de la commande depuis l'URL et confirmation à l'utilisateur.
(function orderConfirmation() {
    const url = new URL(window.location.href);
    const orderId = url.searchParams.get("id");
    document.querySelector("#orderId").innerHTML = `
        ${orderId}<br>
        Merci pour vos achats!`;
})();