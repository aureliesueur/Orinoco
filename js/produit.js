//Création d'un objet représentant le produit sélectionné
const PDTSELECTED = { 
            //Création d'une Key unique 
            KEY : "orinocofrontendaureliesueurproductselected", 
            contents : []
}; 


// Lance la récupération et l'affichage du produit sélectionné quand la page se charge
document.addEventListener("DOMContentLoaded", () => {
    //Récupère le produit sélectionné par son id depuis le serveur
    getProduct();
    //Met à jour le panier
    CART.init();
});


/**
*Fonction pour récupérer un produit précis depuis le serveur grâce à son id intégré aux paramètres de l'URL
*/
function getProduct(id) {   
    //Récupère le id contenu dans les paramètres de la page URL
    let url = new URL(window.location.href);
    id = url.searchParams.get("id");
    //Test de vérification de bon fonctionnement
    console.log(id);
    //Récupération des données via une API fetch 
    fetch('http://localhost:3000/api/furniture/' + id , {mode: "cors"})
        .then(response => response.json())
        .then(response => {
            showItem(response);
            //Test de vérification de bon fonctionnement
            console.log(response);
            //Mise à jour du contenu de l'objet produit affiché
            PDTSELECTED.contents = {
                _id : response._id,
                name: response.name,
                price: response.price,
                description: response.description,
                imageUrl: response.imageUrl,
                quantity: 1
            }; 
            //Conservation du produit mis à jour dans le localStorage
            let storedPdt = JSON.stringify(PDTSELECTED.contents);
            localStorage.setItem(PDTSELECTED.KEY, storedPdt);   
         })
        //Affiche l'erreur si requête ne fonctionne pas
        .catch(error => alert("Erreur : " + error));          
    }
     
/**
*Fonction pour afficher le produit sélectionné dans la page produit.html
*/
function showItem(item) {
    //Capture l'élément du DOM "product-case" qui va afficher toutes les informations
    let pdtCase = document.getElementById("product-case");
    pdtCase.className = "pdtcase";
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
    pdtButtons.className = "pdtcase__buttons";
    pdtCase.appendChild(pdtButtons);
    // Génère et ajoute le menu déroulant de personnalisation du vernis 
    let pdtVarnish = document.createElement("div");
    pdtVarnish.className = "dropdown pdtcase__varnish";
    pdtButtons.appendChild(pdtVarnish);
    
    let varnishBtn = document.createElement("button");
    varnishBtn.className = "btn btn-secondary dropdown-toggle";
    varnishBtn.setAttribute("type", "button");
    varnishBtn.setAttribute("data-toggle", "dropdown");
    varnishBtn.setAttribute("aria-haspopup", "true");
    varnishBtn.setAttribute("aria-expanded", "false");
    varnishBtn.setAttribute("id", "dropdownMenuButton");
    varnishBtn.textContent = "Choisissez votre vernis";
    pdtVarnish.appendChild(varnishBtn);
    
    let varnishChoice = document.createElement("div");
    varnishChoice.className = "dropdown-menu";
    varnishChoice.setAttribute("type", "button");
    varnishChoice.setAttribute("aria-labelledby", "dropdownMenuButton");
    pdtVarnish.appendChild(varnishChoice);
    // Boucle pour créer une ligne du menu déroulant pour chaque vernis, différent selon les produits
    let varnishList = item.varnish;
    for (let i=0 ; i<varnishList.length ; i++) {
        let varnish = document.createElement("a");
        varnish.className = "dropdown-item";
        varnish.setAttribute("href", "#");
        varnish.textContent = varnishList[i];
        varnishChoice.appendChild(varnish);
    }
    // Génère et ajoute le bouton d'ajout 
    let pdtButton = document.createElement("button");
    pdtButton.className = "btn btn-secondary btn__order pdtcase__order";
    pdtButton.setAttribute("role", "button");
    pdtButton.innerHTML = '<i class="fas fa-cart-arrow-down"></i> Ajouter au panier';
    pdtButton.setAttribute("data-id", item._id);
    pdtButton.setAttribute("data-toggle", "modal");
    pdtButton.setAttribute("data-target", "#message-ajout");
    pdtButton.addEventListener("click", addItemOnly); 
    pdtButtons.appendChild(pdtButton); 
}


  
   /* pdtVarnish.innerHTML = '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Choisissez votre vernis</button><div class="dropdown-menu" aria-labelledby="dropdownMenuButton"><a class="dropdown-item" href="#">Dark oak</a><a class="dropdown-item" href="#">Light oak</a><a class="dropdown-item" href="#">Mahogany</a></div></div>';*/
