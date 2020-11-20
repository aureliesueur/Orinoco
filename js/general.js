/*Ensemble des fonctions utiles dans plusieurs pages :
- méthodes ajout, suppression... de l'objet panier CART, 
- affichage de l'icône panier du menu avec nombre de produits commandés. */

//Déclaration des variables avec keys pour stocker dans localStorage

let PRODUCTS = [];
const orderId = {KEY : "orderIdInStorage", value :""};
const orderName = {KEY : "orderNameInStorage", value :""};
const chosenVarnish = {KEY : "chosenVarnishInStorage", value :""};
let count = 0;

let cartCount = document.getElementById("cartcount");


//Déclaration de l'objet "panier"
const CART = { 
    //Création d'une Key unique 
    KEY : "cartContentsInStorage", 
    contents : [],
    init() {
        //Vérification du localStorage pour voir s'il y a déjà des éléments dans le CART
        let storedContents = localStorage.getItem(CART.KEY);
        if (storedContents) {
            //Si oui, on les transfère dans le panier visible sur le navigateur et on met à jour le compteur de l'icône panier
            CART.contents = JSON.parse(storedContents);
            CART.contents.forEach(content => {
                count += content.quantity;
            });
        } else {
            CART.contents = [];
        }
        //Synchronise le CART 
        CART.sync();
    },
    //Méthode pour synchroniser le CART du localStorage à partir du panier du navigateur - et idem pour le compteur.
    async sync() {
        let storedCart = JSON.stringify(CART.contents);
        await localStorage.setItem(CART.KEY, storedCart);
        let storedCount = JSON.stringify(count);
        await localStorage.setItem("count", storedCount);
    },
    //Méthode pour trouver un article dans le panier en les filtrant par l'id
    find(id) {
        let isFound = CART.contents.filter(item => {
            if (item._id == id) {
                return true;
            }
        });
        if (isFound && isFound[0]) {
            return isFound[0];
        }
    },
    //Méthode pour ajouter un produit dans le panier
    add(id, qty=1) { 
        let storedVarnish = localStorage.getItem(chosenVarnish.KEY);
        //Vérifie si ce produit est déjà dans le panier en comparant l'id
        if (CART.find(id)) {
            // Filtre les items du panier par l'id du produit en question
            let filterCart = CART.contents.filter(item => (item._id == id));
            // Vérifie si ce produit présent dans le panier qui a le même id a la même option de varnish
            let isFound = filterCart.filter(item => {
                if (item.varnish == storedVarnish) {
                    return true;
                }
            });
            // Seulement si l'id et le varnish sont identiques, on augmente la quantité de l'article déjà présent dans le panier
            if (isFound && isFound[0]) {
                isFound[0].quantity = isFound[0].quantity + qty; 
            }
            else {
                // Si l'id est identique mais pas le varnish, on ajoute une nouvelle case produit dans le panier du navigateur
                CART.addFromStorage();
            }
        } else {
            // Si l'id est différent, on ajoute une nouvelle case produit dans le panier du navigateur
            CART.addFromStorage();
        } 
        //Met à jour le panier dans le localStorage et actualise le compteur
        count +=1;
        CART.sync();
    },  
    //Méthode pour ajouter un produit dans le panier quand le produit n'y est pas déjà
    addFromStorage() {
        //Récupère le produit grâce au localStorage
        let pdtInStorage = localStorage.getItem(PDTSELECTED.KEY);
        PDTSELECTED.contents = JSON.parse(pdtInStorage);
        //Récupère le vernis choisi grâce au localStorage et l'ajoute au produit
        let storedVarnish = localStorage.getItem(chosenVarnish.KEY);
        PDTSELECTED.contents.varnish = storedVarnish;
        if (PDTSELECTED) {
           //Ajoute le produit au panier dans le navigateur
            CART.contents.push(PDTSELECTED.contents);
        }
    },
    //CONTINUER COMMENTAIRES !!!!
    
    
    //Méthode pour supprimer un article du panier seulement s'il a le même vernis : MARCHE !!
    remove(id, varnish) {
        let filteredCart = CART.contents.filter(item => {
            if (item._id == id) { 
            return true;
           }
        });
        //Test ok
        console.log(filteredCart);
        let sameOrder = filteredCart.filter(item => {
            if (item.varnish == varnish) {
                return true;
            }
        });
        //Test ok
        console.log(sameOrder);
        CART.contents = CART.contents.filter(item => {
          if (item !== sameOrder[0]) { 
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
*Fonction pour supprimer un produit du panier MARCHE OK mais ne récupère que l'id et pas le varnish !!!
*/

/*function suppressItem(e) {
    let id = e.target.getAttribute("data-id");
    console.log(id);
    console.log(CART.contents);
    CART.remove(id);
    //Test de vérification de bon fonctionnement
    console.log("Votre produit a bien été supprimé");
    showCart(); 
}*/



    
/* TEST SUPPRESS */
function suppressItem(e) {
    let data = e.target.getAttribute("data-id");
    let id = data.slice(0, 24);
    let varnish = data.slice(25);
    if (varnish =="") {
        varnish = "Standard";
    }
    //Test de bon fonctionnement
    console.log(id);
    console.log(varnish);
    console.log(CART.contents);
    CART.remove(id, varnish);
    //Test de vérification de bon fonctionnement
    console.log("Votre produit a bien été supprimé");
    showCart(); 
}


/**
*Fonction pour afficher le nombre de produits achetés sur l'icône panier
*/

async function showCount() {
    let storedCount = await localStorage.getItem("count");
    console.log(storedCount);//Test de bon fonctionnement*/
    cartCount.textContent = JSON.parse(storedCount);
} 
