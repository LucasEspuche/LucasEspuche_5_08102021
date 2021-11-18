(function orderConfirmation() {
    let url = new URL(window.location.href);
    let orderId = url.searchParams.get("id");
    document.querySelector("#orderId").innerHTML = `
        ${orderId}<br>
        Merci pour vos achats!`;
})();