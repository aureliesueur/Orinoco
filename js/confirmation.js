/*Ensemble des fonctions et événements relatifs à la page confirmation.html, qui affiche le message de confirmation de commande personnalité avec prénom du user, numéro de commande et prix total */

let confirmedPrice = document.getElementById("sent-price");
let confirmedRef = document.getElementById("sent-ref");
let confirmedName = document.getElementById("sent-name");

// Lance la récupération et l'affichage du prix et de la référence de commande 
document.addEventListener("DOMContentLoaded", () => {
    getTotalPrice();
    //Récupération de la référence dans le localStorage
    confirmedRef.innerHTML = "Référence de commande : <br/>" + localStorage.getItem(orderId.KEY);
    confirmedName.textContent = localStorage.getItem(orderName.KEY);
    localStorage.removeItem(CART.KEY);  
    localStorage.removeItem("count");
    localStorage.removeItem(chosenVarnish.KEY);
});
 
/**
*Fonction qui récupère le prix total dans les paramètres de l'URL
*/
function getTotalPrice() {   
    let url = new URL(window.location.href);
    let price = url.searchParams.get("price");
    confirmedPrice.textContent = "Prix total payé : " + price;
}
