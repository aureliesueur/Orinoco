/*Ensemble des fonctions et événements relatifs à la page produit.html, qui affiche un produit spécifique qu'il a été récupéré depuis le serveur */

//Création d'un objet représentant le produit sélectionné avec key pour le localStorage
const PDTSELECTED = { 
            //Création d'une Key  
            KEY : "pdtSelectedInStorage", 
            contents : []
}; 


// Lance la récupération et l'affichage du produit sélectionné quand la page se charge
document.addEventListener("DOMContentLoaded", () => {
    //Fonction pour récupérer le produit sélectionné depuis le serveur, via son id intégré aux paramètres de l'URL, grâce à une API fetch GET - dans fichier queries.js -
    getProduct();
    //Met à jour le panier et l'icône panier du menu
    CART.init();
    showCount(); 
});

let pdtCase = document.getElementById("product-case");
let pdtImg = document.getElementById("pdt-img");
let pdtStock = document.getElementById("pdt-stock");
let pdtTitle = document.getElementById("pdt-title");
let pdtDescription = document.getElementById("pdt-description");
let pdtPrice = document.getElementById("pdt-price");
let pdtButtons = document.getElementById("pdt-buttons");
let varnishChoice = document.getElementById("pdt-varnish");
let varnishBtn = document.getElementById("dropdownMenuButton");
let pdtButton = document.getElementById("pdt-button");

/**
*Fonction pour afficher le produit sélectionné dans la page produit.html
* @param {Oject} item 
* @return {DOM element} pdtCase.innerHTML Produit affiché
* @return {String} varnishBtn.textContent Option vernis choisie
*/
function showItem(item) { 
    //Actualise l'image du produit
    pdtImg.alt = item.name;
    pdtImg.src = item.imageUrl;
    //Actualise le titre du produit 
    pdtTitle.textContent = item.name;
    //Actualise la description du produit 
    pdtDescription.textContent = item.description;
    //Actualise le prix unitaire du produit
    let totalPrice = new Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR"}).format(item.price/100);
    pdtPrice.textContent = "Prix unitaire : " + totalPrice;
    //Actualise la liste des options de vernis
    let varnishList = item.varnish;
    //Remise à zéro du vernis précédent en le supprimant du localStorage 
    localStorage.removeItem(chosenVarnish.KEY);
    //Boucle pour créer une ligne du menu déroulant pour chaque vernis, différente selon les produits
    for (let i=0 ; i<varnishList.length ; i++) {
        let varnish = document.createElement("span");
        varnish.className = "dropdown-item";
        varnish.textContent = varnishList[i];
        //Quand le user clique sur l'option, elle reste affichée quand le menu se ferme
        varnish.addEventListener("click", function() {
            varnishBtn.textContent = varnishList[i];
            //Stockage du choix de vernis dans le localStorage
            localStorage.setItem(chosenVarnish.KEY, varnishList[i]);
        });
        varnishChoice.appendChild(varnish);
    }
    //Actualise le bouton d'ajout au panier
    pdtButton.setAttribute("data-id", item._id);
    pdtButton.addEventListener("click", addPdtGlobal); 
}

        
/**
*Fonction déclenchée au clic du bouton pour ajouter le produit et mettre à jour le nombre d'articles dans l'icône panier simultanément
* @param {Number} count Compteur de l'icône
* @param {Objet} item Produit affiché
*/
function addPdtGlobal(e) { 
    addItem(e);
    setTimeout(function() {
        showCount(); 
    }, 1000); 
}
  