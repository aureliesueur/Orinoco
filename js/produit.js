/*Ensemble des fonctions et événements relatifs à la page produit.html, qui affiche un produit spécifique */

//Déclaration des variables
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
    //Met à jour le panier
    CART.init();
    showCount(); 
});

     
/**
*Fonction pour afficher le produit sélectionné dans la page produit.html
* @param {Oject} item 
*/
function showItem(item) {
    //Capture l'élément du DOM "product-case" qui va afficher toutes les informations
    let pdtCase = document.getElementById("product-case");
    pdtCase.innerHTML = " ";    
    //Génère et ajoute l'image du produit
    let pdtImg = document.createElement("img");
    pdtImg.className = "pdtcase__img";
    pdtImg.alt = item.name;
    pdtImg.src = item.imageUrl;
    pdtCase.appendChild(pdtImg);
    //Génère et ajoute la pastille "en stock"
    let pdtStock = document.createElement("p");
    pdtStock.className = "pdtcase__stock";
    pdtStock.textContent = "En stock";
    pdtCase.appendChild(pdtStock);
    //Génère et ajoute le nom du produit 
    let pdtTitle = document.createElement("h2");
    pdtTitle.textContent = item.name;
    pdtTitle.className = "pdtcase__title";
    pdtCase.appendChild(pdtTitle);
    //Génère et ajoute la description du produit 
    let pdtDescription = document.createElement("p");
    pdtDescription.textContent = item.description;
    pdtDescription.className = "pdtcase__description";
    pdtCase.appendChild(pdtDescription);
    //Génère et ajoute le prix unitaire du produit
    let pdtPrice = document.createElement("p");
    pdtPrice.className = "pdtcase__price";
    let totalPrice = new Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR"}).format(item.price/100);
    pdtPrice.textContent = "Prix unitaire : " + totalPrice;
    pdtCase.appendChild(pdtPrice);
    //Génère et ajoute une section pour les boutons d'ajout au panier et de personnalisation
    let pdtButtons = document.createElement("div");
    pdtButtons.className = "pdtcase__buttons row";
    pdtCase.appendChild(pdtButtons);
    // Génère et ajoute le menu déroulant de personnalisation du vernis 
    let pdtVarnish = document.createElement("div");
    pdtVarnish.className = "dropdown pdtcase__varnish";
    pdtButtons.appendChild(pdtVarnish);
    // Création du menu déroulant Bootstrap pour la personnalisation
    let varnishBtn = document.createElement("button");
    varnishBtn.className = "btn btn-secondary dropdown-toggle";
    varnishBtn.setAttribute("type", "button");
    varnishBtn.setAttribute("data-toggle", "dropdown");
    varnishBtn.setAttribute("aria-haspopup", "true");
    varnishBtn.setAttribute("aria-expanded", "false");
    varnishBtn.setAttribute("id", "dropdownMenuButton");
    varnishBtn.textContent = "Choisissez votre vernis";
   // varnishBtn.addEventListener("click", alert("Vous devez choisir une finition")); !!!
    pdtVarnish.appendChild(varnishBtn);
    let varnishChoice = document.createElement("div");
    varnishChoice.className = "dropdown-menu";
    varnishChoice.setAttribute("type", "button");
    varnishChoice.setAttribute("aria-labelledby", "dropdownMenuButton");
    pdtVarnish.appendChild(varnishChoice);
    // Boucle pour créer une ligne du menu déroulant pour chaque vernis, différent selon les produits
    let varnishList = item.varnish;
    //Réinitialisation du vernis 
    localStorage.removeItem(chosenVarnish.KEY);
    for (let i=0 ; i<varnishList.length ; i++) {
        let varnish = document.createElement("span");
        varnish.className = "dropdown-item";
        varnish.textContent = varnishList[i];
        //Quand le user clique sur l'option, elle reste affichée quand le menu se ferme
        varnish.addEventListener("click", function() {
            //Test de bon fonctionnement
            console.log(varnishList[i]);
            //Stockage du choix de vernis dans le localStorage
            varnishBtn.textContent = varnishList[i];
            localStorage.setItem(chosenVarnish.KEY, varnishList[i]);
        });
        varnishChoice.appendChild(varnish);
    }
    let pdtButton = document.createElement("button");
    pdtButton.className = "btn btn-secondary btn__order pdtcase__order";
    pdtButton.setAttribute("role", "button");
    pdtButton.innerHTML = '<i class="fas fa-cart-arrow-down"></i> Ajouter au panier';
    pdtButton.setAttribute("data-id", item._id);
    pdtButton.setAttribute("data-toggle", "modal");
    pdtButton.setAttribute("data-target", "#message-ajout");
    pdtButton.addEventListener("click", addPdtGlobal); 
    pdtButtons.appendChild(pdtButton); 
}

        
/**
*Fonction à déclencher au clic du bouton pour ajouter le produit et mettre à jour le nombre d'articles dans l'icône panier simultanément
*/
function addPdtGlobal(e) { 
    addItem(e);
    setTimeout(function() {
        showCount(); 
    }, 1000); 
}
  