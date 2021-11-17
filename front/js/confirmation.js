(function orderConfirmation() {
    let url = new URL(window.location.href);
    let orderId = url.searchParams.get("orderId");
    document.querySelector("#orderId").innerHTML = `
        ${orderId}<br>
        Merci pour vos achats!`;
})();