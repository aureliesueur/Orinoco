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
            CART.contents = [{
                id: 1,
                title: "bracelet or",
                quantity: 1,
                price: 35,
                },{
                id: 2,
                title: "bague argent",
                quantity: 2,
                price: 25
                },{
                id: 3,
                title: "boucles d'oreille rubis",
                quantity: 1,
                price: 75   
                }];
            CART.sync();//Synchronise le CART du localStorage à partir du panier du navigateur
        }
    },
    async sync() {//Synchronise le CART du localStorage à partir du panier du navigateur
        let storedCart = JSON.stringify(CART.contents);
        await localStorage.setItem(CART.KEY, storedCart);
    },
   find(id) {//Trouve un article dans le panier par son id
        let isFound = CART.contents.filter(item => {
            if (item.id == id) {
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
           CART.increase(id, 1); 
        } else {
            let filteredProducts = products.filter(product => {
                if (product.id == id) {
                    return true;
                    //console.log (filteredProducts);Pour tester si ça fonctionne
            }
            });
            if (filteredProducts && filteredProducts[0]) {
                let addItem = {
                    id: filteredProducts[0].id,
                    title: filteredProducts[0].name,
                    price: filteredProducts[0].price,
                    description: filteredProducts[0].description,
                    image: filteredProducts[0].imageUrl
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
    },/*
    increase(id, qty=1) {//Augmente d'1 la quantité du produit visé par l'id
        CART.contents = CART.contents.map(item => {
            if (item.id == id) {
                item.quantity = item.quantity + qty;
            }
            return item;
        });
        // Met à jour le panier dans le localStorage
        CART.sync();
    },
    reduce(id, qty=1) {//Diminue d'1 la quantité du produit visé par l'id
        CART.contents = CART.contents.map(item => {
            if (item.id == id) {
                item.quantity = item.quantity - qty;
            }
            return item;
        });
        // On supprime le produit si sa quantité est nulle
        CART.content.forEach(async item => {//Pourquoi async ici ????
            if (item.it === id && item.quantity ===0) {
                CART.remove(id);
            }
        });
        // Met à jour le panier dans le localStorage
        CART.sync();
    },
    remove(id) {//Supprime totalement un produit du panier
       CART.contents = CART.contents.filter(item => {
           if (item.id !== id) {
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

let products = [];

// Lance la récupération et l'affichage des produits quand la page se charge
document.addEventListener("DOMContentLoaded", () => {
    //Dès que la page est chargée
    getProducts();//Récupère la liste des produits du serveur
    CART.init();//Charge les produits du panier
    CART.logContents();// Test pour être sûr que le lien avec localStorage fonctionne
    //CART.find(2); Test pour être sûr que le lien avec localStorage fonctionne
    showCart();
});

function showCart() {
    let cartSection = document.getElementById("cart-section");
    cartSection.innerHTML = " ";
    CART.contents.forEach(item => {
        //Crée la "case" pour chaque produit du panier
        let cartItem = document.createElement("div");
        cartItem.className = "cartitem";
        //Génère l'image pour chaque case
        let cartImg = document.createElement("img");
        cartImg.className = "cartitem__img";
        cartImg.alt = item.title;
        cartImg.src = item.image;
        cartItem.appendChild(cartImg);
        //Génère le nom de produit pour chaque case
        let cartTitle = document.createElement("h3");
        cartTitle.textContent = item.title;
        cartTitle.className = "cartitem__title";
        cartItem.appendChild(cartTitle);
        //Génère le prix total pour chaque case
        let cartPrice = document.createElement("p");
        cartPrice.className = "cartitem__price";
        let totalPrice = new Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR"}).format(item.price * item.quantity);
        cartPrice.textContent = totalPrice;
        cartItem.appendChild(cartPrice);
        //Génère la quantité de produits achetés pour chaque case
        let cartQty = document.createElement("span");
        cartQty.textContent = item.quantity;
        cartQty.className = "cartitem__qty";
        cartItem.appendChild(cartQty);
        cartSection.appendChild(cartItem);
    })
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
        // Ajoute l'image au produit
        let img = document.createElement("img");
        img.alt = product.name;
        img.src = product.imageUrl;
        img.className = "card__img";
        card.appendChild(img);
        // Crée une div pour les détails
        let details = document.createElement("div");
        details.className = "card__details";
         // Ajoute la div "details" à la case produit
        card.appendChild(details);
        // Ajoute le nom du produit
        let name = document.createElement("h2");
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
        // Ajoute le bouton 
        let button = document.createElement("a");
        button.className = "btn btn-secondary card__button btn__order";
        button.setAttribute("href", "produit.html");
        button.setAttribute("role", "button");
        button.textContent = "Ajouter au panier";
        button.setAttribute("data-id", product.id);// ou product.id ??? CART navigateur ou CART localStorage ??
        button.addEventListener("click", addItem);
        card.appendChild(button); 
        // Ajoute la "case" produit à la section id="products"
        productSection.appendChild(card);
    });
}


function addItem(e) {
    e.preventDefault();
    let id = parseInt(e.target.getAttribute("data-id"));
    console.log("Ajout au panier du produit : ", id);//Pour tester le bon fonctionnement
    CART.add(id);//XXXX attention, lui marque CART.add(id,1);
    showCart(); 
}


//Jouer avec les async et les await : on ne veut pas faire des mauvaises manip avant d'avoir synchronisé les paniers navigateur et localStorage !!
// Reste les évènements à créer
/*init() { : Attention, syntaxe pas acceptée par tous les navigateurs. Syntaxe ancienne init: function() {}
Utiliser Babel pour le transformer en ES5 ??*/
























