let PRODUCTS = [];

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
            CART.contents = [{
                _id: "1ab",
                name: "Etagère vintage",
                quantity: 1,
                price: 3500,
                imageUrl: "http://localhost:3000/images/oak_4.jpg"
                },{
                _id: "28r",
                name: "Armoire patinée",
                quantity: 2,
                price: 2500,
                imageUrl: "http://localhost:3000/images/oak_4.jpg"
                },{
                _id: "3b9",
                name: "Fauteuil Louis XIV",
                quantity: 1,
                price: 7500 ,
                imageUrl: "http://localhost:3000/images/oak_4.jpg"
                }];
        }
        CART.sync();//Synchronise le CART du localStorage à partir du panier du navigateur
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
    add(id) { // FONCTION D'AJOUT AU PANIER A PARTIR DE LA LISTE DES PRODUITS
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
    addProductOnly(id, qty=1) { // FONCTION D'AJOUT AU PANIER A PARTIR DU SEUL PRODUIT AFFICHE ET CHARGE
       //Ajoute le produit affiché pans page "produit" dans le panier du navigateur
        //Vérifie si ce produit est déjà dans le panier
        console.log(CART.contents);//Test
        if (CART.find(id)) {
           CART.increase(id, qty=1); 
            console.log("Produit déjà dans le panier");// Pour tester si ça fonctionne
        } else { // Si le produit n'est pas déjà dans le panier, on le récupère avec son id pour l'ajouter
               fetch('http://localhost:3000/api/furniture/' + id , {mode: "cors"})
                    .then(response => response.json())
                    .then(response => {
                    console.log(response);//Pour tester que ça fonctionne
                    let addProd = {
                        _id: response._id,
                        name: response.name,
                        price: response.price,
                        description: response.description,
                        imageUrl: response.imageUrl,
                        quantity: 1
                    };
                   if (addProd) {
                        console.log(addProd);//Pour tester que ça fonctionne
                    } else {
                        //Message d'erreur si ça ne fonctionne pas 
                        console.log("Produit non valide ou inexistant");
                    }
                    //Ajoute le produit au panier dans le navigateur
                    CART.contents.push(addProd);
                    // Met à jour le panier dans le localStorage
                    CART.sync();
                    })
                    .catch(error => alert("Erreur : " + error));
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
    },
    remove(id) {//Supprime totalement un produit du panier
       CART.contents = CART.contents.filter(item => {
           if (item._id !== id) {
               return true;
           }
        });
        // Met à jour le panier dans le localStorage
        CART.sync();
        cartAmount.textContent = calculateCartAmount() + " EUR"; 
    },
    logContents() {
        console.log(CART.contents);//Pour tester que la synchro du panier fonctionne
    }
};


function addItem(e) { // Fonction pour ajouter un produit au panier depuis la liste
    // Plus tard : e.preventDefault; pour éviter qu'on charge la page du panier tout de suite
    let id = e.target.getAttribute("data-id");
    console.log("Votre produit a bien été ajouté");//Pour tester le bon fonctionnement
    CART.add(id, 1);
}

function addItemOnly(e) { // Fonction pour ajouter le produit unique depuis la page produit
    // Plus tard : e.preventDefault; pour éviter qu'on charge la page du panier tout de suite
    let id = e.target.getAttribute("data-id");
    console.log("Votre produit a bien été ajouté");//Pour tester le bon fonctionnement
    CART.addProductOnly(id, 1);
}


function suppressItem(e) {// Fonction pour supprimer un produit du panier
    let id = e.target.getAttribute("data-id");
    CART.remove(id);
    console.log("Votre produit a bien été supprimé");//Pour tester le bon fonctionnement
    showCart(); 
}


