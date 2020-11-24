/*Ensemble des fonctions et événements relatifs à la page index.html, qui récupère depuis le serveur et affiche la liste des produits à la vente */

// Lance la récupération et l'affichage des produits quand la page se charge
document.addEventListener("DOMContentLoaded", () => {
    //Fonction pour récupérer la liste des produits depuis le serveur grâce à une API fetch GET - dans fichier queries.js -
    getProducts();
    //Met à jour le panier et l'icône panier du menu
    CART.init();
    showCount(); 
    //Pour faire disparaître le 0 sur l'icône panier au chargement de la liste des produits
    if (count == 0) {
        cartCount.style.display = "none";
    }
});
  
/**
*Fonction pour afficher les produits dans la section id="products"
* @param {Array} products Liste des produits récupérés avec l'API fetch GET
* @return {DOM element} productSection.innerHTML Liste des produits affichée par case
*/
function showProducts(products) {
    //Capture l'élément du DOM "products" qui va afficher toutes les informations
    let productSection = document.getElementById("products");
    PRODUCTS = products;
    productSection.innerHTML = "";
    //Boucle qui opère pour chaque produit contenu dans le tableau "products"
    products.forEach(product => {
        // Génère la "case" pour chaque produit
        let card = document.createElement("div");
        card.className = "card";
        // Génère une div pour les éléments, photo et détails
        let cardElements = document.createElement("div");
        cardElements.className = "card__elements element";
        card.appendChild(cardElements);
        // Génère l'image au produit
        let img = document.createElement("img");
        img.alt = product.name;
        img.src = product.imageUrl;
        img.className = "element__img";
        img.style.width = "200px";
        cardElements.appendChild(img);
        // Génère une div pour les détails
        let details = document.createElement("div");
        details.className = "element__details";
        cardElements.appendChild(details);
        // Génère le titre du produit
        let name = document.createElement("h3");
        name.className = "card__name";
        name.textContent = product.name;
        details.appendChild(name);
        // Génère la description du produit
        let description = document.createElement("p");
        description.className = "card__description";
        description.textContent = product.description;
        details.appendChild(description); 
         // Génère le prix du produit
        let price = document.createElement("p");
        price.className = "card__price";
        let cost = new Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR"}).format(product.price / 100);
        price.textContent = cost;
        details.appendChild(price); 
        //Génère une div pour le bouton
        let cardBtns = document.createElement("div");
        cardBtns.className = "card__btns";
        card.appendChild(cardBtns);
        // Génère le bouton pour afficher détails du produit
        let btnDetails = document.createElement("a");
        btnDetails.className = "btn btn-secondary card__btnDetails btn__details";
        btnDetails.setAttribute("role", "button");
        btnDetails.innerHTML = '<i class="fas fa-info-circle"></i> En savoir plus';
        //btnDetails.setAttribute("data-id", product._id);
        //Envoie l'info du id du produit sélectionné à la page produit.html via les paramètres de l'url
        btnDetails.setAttribute("href", "produit.html?id=" + product._id + "");
        cardBtns.appendChild(btnDetails); 
        productSection.appendChild(card);
    });
}



