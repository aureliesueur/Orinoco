/*Ensemble des fonctions et événements relatifs à la page index.html, qui affiche la liste des produits à la vente */

// Lance la récupération et l'affichage des produits quand la page se charge
document.addEventListener("DOMContentLoaded", () => {
    //Pour vider localStorage après bugs et tout remettre à zéro
    //localStorage.clear(); 
    //Fonction pour récupérer la liste des produits depuis le serveur grâce à une API fetch GET - dans fichier queries.js -
    getProducts();
    //Met à jour le panier
    CART.init();
    showCount(); 
});

   
/**
*Fonction pour afficher les produits dans la section id="products"
* @param {Array} products 
*/
function showProducts(products) {
    //Capture l'élément du DOM "products" qui va afficher toutes les informations
    let productSection = document.getElementById("products");
    PRODUCTS = products;
    productSection.innerHTML = "";
    products.forEach(product => {
        // Crée la "case" pour chaque produit
        let card = document.createElement("div");
        card.className = "card";
        // Crée une div pour les éléments, photo et détails
        let cardElements = document.createElement("div");
        cardElements.className = "card__elements element";
        // Ajoute la div "éléments" à la case produit
        card.appendChild(cardElements);
        // Ajoute l'image au produit
        let img = document.createElement("img");
        img.alt = product.name;
        img.src = product.imageUrl;
        img.className = "element__img";
        img.style.width = "200px";
        cardElements.appendChild(img);
        // Crée une div pour les détails
        let details = document.createElement("div");
        details.className = "element__details";
         // Ajoute la div "details" à la case produit
        cardElements.appendChild(details);
        // Ajoute le nom du produit
        let name = document.createElement("h3");
        name.className = "card__name";
        name.textContent = product.name;
        details.appendChild(name);
        // Ajoute la description du produit
        let description = document.createElement("p");
        description.className = "card__description";
        description.textContent = product.description;
        details.appendChild(description); 
         // Ajoute le prix du produit
        let price = document.createElement("p");
        price.className = "card__price";
        let cost = new Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR"}).format(product.price / 100);
        price.textContent = cost;
        details.appendChild(price); 
        //Crée et ajoute une div pour le bouton
        let cardBtns = document.createElement("div");
        cardBtns.className = "card__btns";
        card.appendChild(cardBtns);
        // Crée et ajoute le bouton pour afficher détails du produit
        let btnDetails = document.createElement("a");
        btnDetails.className = "btn btn-secondary card__btnDetails btn__details";
        btnDetails.setAttribute("role", "button");
        btnDetails.innerHTML = '<i class="fas fa-info-circle"></i> En savoir plus';
        btnDetails.setAttribute("data-id", product._id);
        btnDetails.setAttribute("href", "produit.html?id=" + product._id + "");//Envoie l'info du id du produit sélectionné à la page produit.html via les paramètres de l'url
        cardBtns.appendChild(btnDetails); 
        productSection.appendChild(card);
    });
}

//let messageAdd = document.getElementById("message-add");

/**
*Fonction globale à déclencher au clic du bouton, pour afficher le message d'ajout et mettre à jour le nombre d'articles dans l'icône panier
*/
function addIncludeMessage(e) { 
    addItem(e);
    //messageAdd.style.opacity= "1";
    setTimeout(function() {
        //messageAdd.style.opacity= "0";
        showCount(); 
    }, 1000); 
}



