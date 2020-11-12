
// Lance la récupération et l'affichage du produit sélectionné quand la page se charge
document.addEventListener("DOMContentLoaded", () => {
    getProduct();//Récupère le produit sélectionné par son id depuis le serveur
    CART.init();
});

function getProduct(id) {   
    //Récupère le id contenu dans les paramètres de la page url
    let url = new URL(window.location.href);
    id = url.searchParams.get("id");
    console.log(id);
    fetch('http://localhost:3000/api/furniture/' + id , {mode: "cors"})
        .then(response => response.json())
        .then(response => {
            showItem(response);
            console.log(response);//Pour tester que ça fonctionne
        })
        .catch(error => alert("Erreur : " + error));
}
    
function showItem(item) { //Fonction pour afficher le produit sélectionner dans la page produit.html
    let pdtCase = document.getElementById("product-case");
    pdtCase.className = "pdtcase";
    pdtCase.innerHTML = " ";    
    //Génère l'image du produit
    let pdtImg = document.createElement("img");
    pdtImg.className = "pdtcase__img";
    pdtImg.alt = item.name;
    pdtImg.src = item.imageUrl;
    pdtCase.appendChild(pdtImg);
    //Génère la pastille "en stock"
    let pdtStock = document.createElement("p");
    pdtStock.className = "pdtcase__stock";
    pdtStock.textContent = "En stock";
    pdtCase.appendChild(pdtStock);
    //Génère le nom du produit 
    let pdtTitle = document.createElement("h2");
    pdtTitle.textContent = item.name;
    pdtTitle.className = "pdtcase__title";
    pdtCase.appendChild(pdtTitle);
    //Génère la description du produit 
    let pdtDescription = document.createElement("p");
    pdtDescription.textContent = item.description;
    pdtDescription.className = "pdtcase__description";
    pdtCase.appendChild(pdtDescription);
    //Génère le prix unitaire du produit
    let pdtPrice = document.createElement("p");
    pdtPrice.className = "pdtcase__price";
    let totalPrice = new Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR"}).format(item.price/100);
    pdtPrice.textContent = "Prix unitaire : " + totalPrice;
    pdtCase.appendChild(pdtPrice);
    //Génère une section pour les boutons d'ajout au panier et de personnalisation
    let pdtButtons = document.createElement("div");
    pdtButtons.className = "pdtcase__buttons";
    pdtCase.appendChild(pdtButtons);
    // Génère le menu déroulant de personnalisation du vernis 
    let pdtVarnish = document.createElement("div");
    pdtVarnish.className = "dropdown pdtcase__varnish";
    pdtVarnish.textContent = "Personnalisez votre finition !";
    pdtButtons.appendChild(pdtVarnish);
    pdtVarnish.innerHTML = '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Choisissez votre vernis</button><div class="dropdown-menu" aria-labelledby="dropdownMenuButton"><a class="dropdown-item" href="#">Dark oak</a><a class="dropdown-item" href="#">Light oak</a><a class="dropdown-item" href="#">Mahogany</a></div></div>';
    // Ajoute le bouton 
    let pdtButton = document.createElement("button");
    pdtButton.className = "btn btn-secondary btn__order pdtcase__order";
    pdtButton.setAttribute("role", "button");
    pdtButton.innerHTML = '<i class="fas fa-cart-arrow-down"></i> Ajouter au panier';
    pdtButton.setAttribute("data-id", item._id);
    pdtButton.addEventListener("click", addItemOnly);
    pdtButtons.appendChild(pdtButton); 
    // Crée une div pour le message animé "ajouté !"
    let messageAddElt = document.createElement("div");
    messageAddElt.className = "message-addelt";
    messageAddElt.innerHTML = '<i class="fas fa-check"></i> Article ajouté !';
    // Ajoute la div "éléments" à la case cardBtns
    pdtButtons.appendChild(messageAddElt);
}

/*pdtButton.addEventListener("click", function() { MARCHE PAS, DESACTIVE LE ADD ITEM
    addItem;
    messageAddElt.style.opacity= "1";
    setTimeout(function() {
        messageAddElt.style.opacity= "0";
    }, 1000);
});*/



