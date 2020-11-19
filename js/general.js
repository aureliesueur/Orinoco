/*Ensemble des fonctions utiles dans plusieurs pages :
- méthodes ajout, suppression... de l'objet panier CART, 
- affichage de l'icône panier du menu avec nombre de produits commandés. */

//Déclaration des variables avec keys pour stocker dans localStorage

let PRODUCTS = [];
const orderId = {KEY : "orderIdInStorage", value :""};
const orderName = {KEY : "orderNameInStorage", value :""};
const chosenVarnish = {KEY : "chosenVarnishInStorage", value :""};
let count = 0;


//Déclaration de l'objet "panier"
const CART = { 
    //Création d'une Key unique 
    KEY : "cartContentsInStorage", 
    contents : [],
    init() {
        //Vérification du LocalStorage pour voir s'il y a déjà des éléments dans le CART
        let storedContents = localStorage.getItem(CART.KEY);
        if (storedContents) {
            CART.contents = JSON.parse(storedContents);
            CART.contents.forEach(content => {
                count += content.quantity;
                //console.log(count);
            });
        } else {
            //Données factices pour tester le bon fonctionnement
            CART.contents = [/*{
                _id: "1ab",
                name: "Etagère vintage",
                quantity: 1,
                price: 3500,
                imageUrl: "http://localhost:3000/images/oak_4.jpg",
                varnish: Mahogany
                },{
                _id: "28r",
                name: "Armoire patinée",
                quantity: 2,
                price: 2500,
                imageUrl: "http://localhost:3000/images/oak_4.jpg",
                varnish: Mahogany
                },{
                _id: "3b9",
                name: "Fauteuil Louis XIV",
                quantity: 1,
                price: 7500 ,
                imageUrl: "http://localhost:3000/images/oak_4.jpg",
                varnish: Mahogany
                }*/];
            /*count = 4;*/
        }
        //Synchronise le CART 
        CART.sync();
    },
    //Méthode pour synchroniser le CART du localStorage à partir du panier du navigateur
    async sync() {
        let storedCart = JSON.stringify(CART.contents);
        await localStorage.setItem(CART.KEY, storedCart);
        let storedCount = JSON.stringify(count);
        await localStorage.setItem("count", storedCount);
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
    add(id, qty=1) { 
        let storedVarnish = localStorage.getItem(chosenVarnish.KEY);
        //Vérifie si ce produit est déjà dans le panier en comparant l'id
        if (CART.find(id)) {
            console.log("id trouvé");
            let filterCart = CART.contents.filter(item => (item._id == id));
            //Test
            console.log(filterCart[0]);
            //Vérifie si ce produit qui a le même id a la mêem option de varnish
            let isFound = filterCart.filter(item => {
                if (item.varnish == storedVarnish) {
                    return true;
                }
            });
            // Seulement si même id et même varnish, on augmente la quantité
            if (isFound && isFound[0]) {
                //Pour tester que ça fonctionne
                console.log(isFound[0]);
                isFound[0].quantity = isFound[0].quantity + qty; 
            }
            else {
                CART.addFromStorage();
            }
        } else {
            CART.addFromStorage();
        } 
        //Met à jour le panier dans le localStorage
        count +=1;
        CART.sync();
    },  
    addFromStorage() {
        //Si le produit n'est pas déjà dans le panier, on le récupère grâce au localStorage
        let pdtInStorage = localStorage.getItem(PDTSELECTED.KEY);
        PDTSELECTED.contents = JSON.parse(pdtInStorage);
        //On récupère le vernis choisi grâce au localStorage et on l'ajoute au produit
        let storedVarnish = localStorage.getItem(chosenVarnish.KEY);
        //Test de vérification de bon fonctionnement
        console.log(storedVarnish);
        PDTSELECTED.contents.varnish = storedVarnish;
        //Test de vérification de bon fonctionnement
        console.log(PDTSELECTED.contents);
        if (PDTSELECTED) {
           //Ajoute le produit au panier dans le navigateur
            CART.contents.push(PDTSELECTED.contents);
        }
    },
    remove(id) {//Supprime totalement un article du panier
        //let storedVarnish = localStorage.getItem(chosenVarnish.KEY);
        CART.contents = CART.contents.filter(item => {
          if (item._id !== id) { //((item._id == id) && (item.varnish !== storedVarnish))
               return true;
           }
        });
        // Met à jour le panier dans le localStorage et l'icône panier du menu
        CART.sync();
        //Met à jour le prix total
        cartAmount.textContent = calculateCartAmount() + " EUR";
        //Recalcul de l'icône panier
        let storedContents = localStorage.getItem(CART.KEY);
        count = 0;
        if (storedContents) {
            CART.contents = JSON.parse(storedContents);
            CART.contents.forEach(content => {
                count += content.quantity;
            });
        } else {
            count = 0;
        }
        localStorage.getItem("count");
        setTimeout(function() {
            showCount(); 
        }, 1000);  
     },
    //Méthode pour afficher le contenu du panier
    logContents() {
        console.log(CART.contents);//Test de vérification de bon fonctionnement
    }
};

/**
*Fonction pour ajouter le produit unique au panier depuis la page produit
*/
function addItem(e) { // 
    let id = e.target.getAttribute("data-id");
    //Test de vérification de bon fonctionnement
    console.log("Votre produit a bien été ajouté");
    CART.add(id, 1);
}

/**
*Fonction pour supprimer un produit du panier
*/
function suppressItem(e) {
    let id = e.target.getAttribute("data-id");
    console.log(id);
    console.log(CART.contents);
    CART.remove(id);
    //Test de vérification de bon fonctionnement
    console.log("Votre produit a bien été supprimé");
    showCart(); 
}

/**
*Fonction pour afficher le nombre de produits achetés sur l'icône panier
*/
let cartCount = document.getElementById("cartcount");

async function showCount() {
    let storedCount = await localStorage.getItem("count");
    console.log(storedCount);//Test de bon fonctionnement*/
    cartCount.textContent = JSON.parse(storedCount);
} 
