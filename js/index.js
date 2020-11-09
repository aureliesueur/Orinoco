/*Création du panier*/

const CART = { //Déclaration de la constante "panier"
    KEY : "orinocofrontendaureliesueur", // Création d'une Key unique 
    contents : [],
    init() {
        //Vérification du LocalStorage pour voir s'il y a déjà des éléments dans le CART
        let storedContents = localStorage.getItem(CART.KEY);
        if (storedContents) {
            CART.contents = JSON.parse(storedContents);
        } else {
        // Fausses données juste pour vérifier que tout fonctionne
            CART.contents = [/*{
                _id: "1ab",
                name: "bracelet or",
                quantity: 1,
                price: 3500,
                imageUrl: "http://localhost:3000/images/oak_4.jpg"
                },{
                _id: "28r",
                name: "bague argent",
                quantity: 2,
                price: 2500,
                imageUrl: "http://localhost:3000/images/oak_4.jpg"
                },{
                _id: "3b9",
                name: "boucles d'oreille rubis",
                quantity: 1,
                price: 7500 ,
                imageUrl: "http://localhost:3000/images/oak_4.jpg"
                }*/];
            CART.sync();//Synchronise le CART du localStorage à partir du panier du navigateur
        }
    },
     async sync() {//Synchronise le CART du localStorage à partir du panier du navigateur
        let storedCart = JSON.stringify(CART.contents);
         await localStorage.setItem(CART.KEY, storedCart);
    },
   find(id) {//Trouve un article dans le panier par son id
        let isFound = CART.contents.filter(item => {
            if (item._id == id) {
                return true;
            }
        });
        if (isFound && isFound[0]) {
            console.log(isFound[0]);//Pour tester que ça fonctionne
            return isFound[0];
        }
    },
    add(id) {
        //Ajoute un nouveau produit dans le panier du navigateur
        //Vérifie si ce produit est déjà dans le panier
        if (CART.find(id)) {
           CART.increase(id, qty=1); 
        } else {
            let filterPds = PRODUCTS.filter(product => {
                if (product._id == id) {
                    return true;
            }
            });
            if (filterPds && filterPds[0]) {
                let addItem = {
                    _id: filterPds[0]._id,
                    name: filterPds[0].name,
                    price: filterPds[0].price,
                    description: filterPds[0].description,
                    imageUrl: filterPds[0].imageUrl,
                    quantity: 1
                };
                //Ajoute le produit au panier dans le navigateur
                CART.contents.push(addItem);
                // Met à jour le panier dans le localStorage
                CART.sync();
            } else {
                //Message d'erreur si l'id ne correspond à aucun produit 
                console.log("Produit non valide ou inexistant");
            }    
        }
    },
    increase(id, qty = 1) {//Augmente d'1 la quantité du produit visé par l'id
        CART.contents = CART.contents.map(item => {
            if (item._id == id) {
                item.quantity = item.quantity + qty;
            }
            return item;
        });
        // Met à jour le panier dans le localStorage
        CART.sync();
    },/*
    reduce(id, qty=1) {//Diminue d'1 la quantité du produit visé par l'id
        CART.contents = CART.contents.map(item => {
            if (item._id === id && item.quantity >=1) {
                item.quantity = item.quantity - qty;
            } 
            return item;
        });
        // On supprime le produit si sa quantité est nulle
        CART.contents.forEach(async item => {//Pourquoi async ici ????
            if (item._it === id && item.quantity <=0) {
                CART.remove(id);
            }
        });
        // Met à jour le panier dans le localStorage
        CART.sync();
    },
    remove(id) {//Supprime totalement un produit du panier
       CART.contents = CART.contents.filter(item => {
           if (item._id !== id) {
               return true;
           }
        });
        // Met à jour le panier dans le localStorage
        CART.sync();
    },
    empty() {//Vide le panier sur le navigateur puis synchronise avec le CART du localStorage
        CART.contents = [];
        CART.sync();    
    },*/
    logContents() {
        console.log(CART.contents);
    }
};

let PRODUCTS = [];
let cartAmount = document.getElementById("cart-amount");

// Lance la récupération et l'affichage des produits quand la page se charge
document.addEventListener("DOMContentLoaded", () => {
    getProducts();//Récupère la liste des produits du serveur
    CART.init();//Charge les produits du panier
    CART.logContents();// Test pour être sûr que le lien avec localStorage fonctionne
    //CART.find(2); Test pour être sûr que le lien avec localStorage fonctionne
    showCart();
    cartAmount.textContent = calculateCartAmount() + " EUR";
});

function showCart() {//Fonction qui affiche le panier à l'écran
    let cartSection = document.getElementById("cart-section");
    cartSection.innerHTML = " ";
    CART.contents.forEach(item => {
        //Crée la "case" pour chaque produit du panier
        let cartItem = document.createElement("div");
        cartItem.className = "cartitem";
        //Génère l'image pour chaque case
        let cartImg = document.createElement("img");
        cartImg.className = "cartitem__img";
        cartImg.alt = item.name;
        cartImg.src = item.imageUrl;
        cartImg.style.width = "10%";
        cartItem.appendChild(cartImg);
        //Génère le nom de produit pour chaque case
        let cartTitle = document.createElement("h3");
        cartTitle.textContent = item.name;
        cartTitle.className = "cartitem__title";
        cartItem.appendChild(cartTitle);
        //Génère la quantité de produits achetés pour chaque case
        let cartQty = document.createElement("span");
        cartQty.textContent = item.quantity;
        cartQty.className = "cartitem__qty";
        cartItem.appendChild(cartQty);
        //Génère le prix total pour chaque case
        let cartPrice = document.createElement("p");
        cartPrice.className = "cartitem__price";
        let totalPrice = new Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR"}).format(item.price/100 * item.quantity);
        cartPrice.textContent = totalPrice;
        cartItem.appendChild(cartPrice);
        // Ajoute le bouton 
        let cartButton = document.createElement("button");
        cartButton.className = "btn btn-secondary cartitem__button btn__remove";
        cartButton.setAttribute("role", "button");
        cartButton.textContent = "Supprimer du panier";
        cartButton.setAttribute("data-id", item._id);
        cartButton.addEventListener("click", suppressItem);
        cartItem.appendChild(cartButton); 
        // Ajoute la "case" produit du panier à la section id="cart-section"
        cartSection.appendChild(cartItem);
    })
}

 function calculateCartAmount() {//Fonction qui calcule le montant total du panier en Euros
    let totalPrice = 0;
    CART.contents.forEach(item => {
       totalPrice += (item.price/100 * item.quantity)
    });
    return totalPrice;
  }


function getProducts() { 
    // Création de la fonction pour récupérer la liste des produits depuis le serveur
    fetch("http://localhost:3000/api/furniture", {mode: "cors"})
        .then(response => response.json())
        .then(response => {
            showProducts(response);
            console.log(response);//Pour tester que ça fonctionne
        })
        .catch(error => alert("Erreur : " + error));
}
    

function showProducts(products) {
    // Utilise les data récupérées par le fetch pour afficher les produits dans la section id="products"
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
        //Ajoute une div pour les deux boutons
        let cardBtns = document.createElement("div");
         // Ajoute la div "divBtns" à la case produit
        cardBtns.className = "card__btns";
        card.appendChild(cardBtns);
        // Crée le bouton pour ajouter au panier
        let btnOrder = document.createElement("a");
        btnOrder.className = "btn btn-secondary card__button btn__order";
        btnOrder.setAttribute("role", "button");
        btnOrder.innerHTML = '<i class="fas fa-cart-arrow-down"></i> Ajouter au panier';
        btnOrder.setAttribute("data-id", product._id);
        btnOrder.addEventListener("click", addItem);
        cardBtns.appendChild(btnOrder); 
        // Crée le bouton pour afficher détails du produit
        let btnDetails = document.createElement("a");
        btnDetails.className = "btn btn-secondary card__button btn__details";
        btnDetails.setAttribute("role", "button");
        btnDetails.innerHTML = '<i class="fas fa-info-circle"></i> En savoir plus';
        btnDetails.setAttribute("data-id", product._id);
        btnDetails.setAttribute("href", "produit.html?id=" + product._id + "");//Envoie l'info du id du produit sélectionné à la page produit.html via les paramètres de l'url
        cardBtns.appendChild(btnDetails); 
        // Ajoute la "case" produit à la section id="products"
        productSection.appendChild(card);
    });
}

// Lance la récupération et l'affichage du produit sélectionné quand la page se charge
document.addEventListener("DOMContentLoaded", () => {
    getProduct();//Récupère le produit sélectionné par son id depuis le serveur
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
    pdtButton.className = "btn btn-secondary pdtcase__order";
    pdtButton.setAttribute("role", "button");
    pdtButton.textContent = "Ajouter au panier";
    pdtButton.setAttribute("data-id", item._id);
    pdtButton.addEventListener("click", addItem);
    pdtButtons.appendChild(pdtButton); 
}


function addItem(e) {
    // Plus tard : e.preventDefault; pour éviter qu'on charge la page du panier tout de suite
    let id = e.target.getAttribute("data-id");
    console.log("Votre produit a bien été ajouté");//Pour tester le bon fonctionnement
    CART.add(id, 1);//XXXX attention, lui marque CART.add(id,1);
    showCart(); 
}

function suppressItem(e) {
    let id = e.target.getAttribute("data-id");
    console.log("Votre produit a bien été supprimé");//Pour tester le bon fonctionnement
    CART.reduce(id, 1);//XXXX attention, lui marque CART.add(id,1);
    showCart(); 
}


//Jouer avec les async et les await : on ne veut pas faire des mauvaises manip avant d'avoir synchronisé les paniers navigateur et localStorage !!
// Reste les évènements à créer
/*init() { : Attention, syntaxe pas acceptée par tous les navigateurs. Syntaxe ancienne init: function() {}
Utiliser Babel pour le transformer en ES5 ??*/


/*
let buttonConfirm = document.getElementById("confirm");
let formElt = document.getElementById("form-section");
buttonConfirm.addEventListener("click", () => {
    formElt.innerHTML = '<div class="row"><div class="col-12 jumbotron"><h2>Pour finaliser votre commander, merci de remplir ce formulaire.</h2><div class="form-group"><label for="name">Nom :</label><input type="text" name="name" class="form-control" placeholder="Par ex. Delavigne" id="name" required></div><div class="form-group"><label for="firstname">Prénom :</label><input type="text" name="firstname" class="form-control" placeholder="Par ex. Martin" id="firstname" required></div><div class="form-group"><label for="email">Email :</label><input type="email" name="email" class="form-control" placeholder="Par ex. martin.delavigne@gmail.com" id="email" required></div><div class="form-group"><label for="adress">Adresse :</label><input type="text" class="form-control" placeholder="Par ex. 12 rue Fontaine" id="address" required></div><div class="form-group"><label <input type="number" class="form-control" placeholder="Par ex. 84100" id="postcode" required></div><div class="form-group"><label for="city">Ville :</label><input type="text" class="form-control" placeholder="Par ex. Lyon" id="city" required></div><div class="form-group form-check"><input class="form-check-input" type="checkbox" id="newsletter"><label class="form-check-label for="gridCheck>Recevoir notre newsletter</label></div><button type="submit" class="btn btn-success">Commander</button></div></div>';
});

   */             
         



















