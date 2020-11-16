/*function getTotalPrice(id) {   
    //Récupère le prix total du panier contenu dans les paramètres de la page URL
    let url = new URL(window.location.href);
    totalPrice = url.searchParams.get("id");
    //Test de vérification de bon fonctionnement
    console.log(id);
}*/

let confirmedPrice = document.getElementById("sent-price");
let confirmedRef = document.getElementById("sent-ref");

// Lance la récupération et l'affichage du prix et de la référence de commande 
document.addEventListener("DOMContentLoaded", () => {
    //Récupération du prix total inclus dans le paramètre de l'URL
    let url = new URL(window.location.href);
    let price = url.searchParams.get("price");
    confirmedPrice.textContent = "Prix total payé : " + price;
    //Récupération de la référence dans le localStorage
    confirmedRef.innerHTML = "Référence de commande : <br/>" + localStorage.getItem(ORDERID.KEY);  
    localStorage.removeItem(CART.KEY);   
});
    

