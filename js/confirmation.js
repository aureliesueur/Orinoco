/*Ensemble des fonctions et événements relatifs à la page confirmation.html, qui affiche le message de confirmation de commande personnalité avec prénom du user, numéro de commande et prix total */


//Capture des éléments du DOM
let confirmedPrice = document.getElementById("sent-price");
let confirmedRef = document.getElementById("sent-ref");
let confirmedName = document.getElementById("sent-name");

// Lance la récupération et l'affichage du prix et de la référence de commande 
document.addEventListener("DOMContentLoaded", () => {
    getTotalPrice();
    //Récupération de la référence dans le localStorage
    confirmedRef.innerHTML = "Référence de commande : <br/>" + localStorage.getItem(orderId.KEY);
    //Récupération du prénom du user dans le localStorage
    confirmedName.textContent = localStorage.getItem(orderName.KEY);
    //Remise à 0 du panier, du compteur, et de l'option varnish
    localStorage.removeItem(CART.KEY);  
    localStorage.removeItem("count");
    localStorage.removeItem("chosenVarnish");
    localStorage.remove("storedPdt");
});
 
/**
*Fonction qui récupère le prix total dans les paramètres de l'URL
*/
function getTotalPrice() {   
    let url = new URL(window.location.href);
    let price = url.searchParams.get("price");
    confirmedPrice.textContent = "Prix total payé : " + price;
}
