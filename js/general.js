let PRODUCTS = [];

/*Création du panier*/

//Déclaration de l'objet "panier"
const CART = { 
    //Création d'une Key unique 
    KEY : "orinocofrontendaureliesueur", 
    contents : [],
    init() {
        //Vérification du LocalStorage pour voir s'il y a déjà des éléments dans le CART
        let storedContents = localStorage.getItem(CART.KEY);
        if (storedContents) {
            CART.contents = JSON.parse(storedContents);
        } else {
            //Données factices pour tester le bon fonctionnement
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
        //Synchronise le CART 
        CART.sync();
    },
    //Méthode pour synchroniser le CART du localStorage à partir du panier du navigateur
    async sync() {
        let storedCart = JSON.stringify(CART.contents);
         await localStorage.setItem(CART.KEY, storedCart);
    },
    //Méthode pour trouver un article dans le panier par son id
    find(id) {
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
    //Méthode pour ajouter un nouveau produit dans le panier du navigateur, avec accès à la liste des produits
    add(id) {  
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
                //Met à jour le panier dans le localStorage
                CART.sync();
            } else {
                //Message d'erreur si l'id ne correspond à aucun produit 
                console.log("Produit non valide ou inexistant");
            }    
        }
    },
    //Méthode pour ajouter le produit affiché pans page "produit", avec accès au produit seul
    addProductOnly(id, qty=1) { 
        //Vérifie si ce produit est déjà dans le panier
        console.log(CART.contents);//Test
        if (CART.find(id)) {
           CART.increase(id, qty=1); 
            //Test de vérification de bon fonctionnement
            console.log("Produit déjà dans le panier");
        } else { 
            //Si le produit n'est pas déjà dans le panier, on le récupère grâce au localStorage
            let pdtInStorage = localStorage.getItem(PDTSELECTED.KEY);
            PDTSELECTED.contents = JSON.parse(pdtInStorage);
            //Test de vérification de bon fonctionnement
            console.log(PDTSELECTED.contents);
           if (PDTSELECTED) {
               //Ajoute le produit au panier dans le navigateur
                CART.contents.push(PDTSELECTED.contents);
                //Met à jour le panier dans le localStorage
                CART.sync();
            } else {
                //Message d'erreur si ça ne fonctionne pas 
                console.log("Produit non valide ou inexistant");
            }
        }
    },
    //Méthode pour augmenter d'1 la quantité du produit visé par l'id
    increase(id, qty = 1) {
        CART.contents = CART.contents.map(item => {
            if (item._id == id) {
                item.quantity = item.quantity + qty;
            }
            return item;
        });
        //Met à jour le panier dans le localStorage
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
    //Méthode pour afficher le contenu du panier
    logContents() {
        console.log(CART.contents);//Test de vérification de bon fonctionnement
    }
};

/**
*Fonction pour ajouter un produit au panier depuis la liste des produits
*/
function addItem(e) {  
    let id = e.target.getAttribute("data-id");
    //Test de vérification de bon fonctionnement
    console.log("Votre produit a bien été ajouté");
    CART.add(id, 1);
}

/**
*Fonction pour ajouter le produit unique au panier depuis la page produit
*/
function addItemOnly(e) { // 
    let id = e.target.getAttribute("data-id");
    //Test de vérification de bon fonctionnement
    console.log("Votre produit a bien été ajouté");
    CART.addProductOnly(id, 1);
}

/**
*Fonction pour supprimer un produit du panier
*/
function suppressItem(e) {
    let id = e.target.getAttribute("data-id");
    CART.remove(id);
    //Test de vérification de bon fonctionnement
    console.log("Votre produit a bien été supprimé");
    showCart(); 
}


