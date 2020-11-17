

let confirmedPrice = document.getElementById("sent-price");
let confirmedRef = document.getElementById("sent-ref");
let confirmedName = document.getElementById("sent-name");

// Lance la récupération et l'affichage du prix et de la référence de commande 
document.addEventListener("DOMContentLoaded", () => {
    getTotalPrice();
    //Récupération de la référence dans le localStorage
    confirmedRef.innerHTML = "Référence de commande : <br/>" + localStorage.getItem(ORDERID.KEY);
    confirmedName.textContent = localStorage.getItem(ORDERNAME.KEY);
    localStorage.removeItem(CART.KEY);  
    localStorage.removeItem("count");
});
 
/**
*Fonction qui récupère le prix total dans les paramètres de l'URL
*/
function getTotalPrice() {   
    //Récupère le prix total du panier contenu dans les paramètres de la page URL
    let url = new URL(window.location.href);
    let price = url.searchParams.get("price");
    confirmedPrice.textContent = "Prix total payé : " + price;
}
