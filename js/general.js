/*Ensemble des fonctions utiles dans plusieurs pages :
- méthodes ajout, suppression... de l'objet panier CART, 
- affichage de l'icône panier du menu avec nombre de produits commandés. */

//Déclaration des variables stockées dans localStorage
let orderId = "";
let orderName = "";
let chosenVarnish = "";
let count = 0;

//Captation des élements du DOM
let cartCount = document.getElementById("cartcount");


//Déclaration de l'objet "panier"
const CART = { 
    //Création d'une Key unique 
    KEY : "cartContentsInStorage", 
    contents : [],
    /**
    * Méthode pour initialiser le CART 
    * @ param {Array} storedContents Produits déjà contenus dans le panier
    * @ return {Array} CART.contents Contenu du panier du navigateur
    * @ return {number} count Compteur indiquant le nombre de produits dans le panier du navigateur
    */
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
    /**
    * Méthode pour synchroniser le CART du localStorage à partir du panier du navigateur - et idem pour le compteur.
    * @ param {Array} CART.contents Produits déjà contenus dans le panier du navigateur
    * @ param {number} count Compteur de l'icône panier du menu
    * @ return {Array} storedCount Contenu du panier dans le  localStorage 
    * @ return {number} storedCount Contenu du compteur dans le localStorage
    */
    async sync() {
        let storedCart = JSON.stringify(CART.contents);
        await localStorage.setItem(CART.KEY, storedCart);
        let storedCount = JSON.stringify(count);
        await localStorage.setItem("count", storedCount);
    },
    /**
    * Méthode pour trouver un article dans le panier en les filtrant par l'id
    * @param {String} id Id que l'on recherche
    * @return {Object} isFound[0] Premier produit résultat de la recherche
    */
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
    /**
    * Méthode pour ajouter un produit dans le panier
    * @param {String} id Id du produit que l'on souhaite ajouter
    * @return {Number} isFound[0].quantity Quantité de l'article trouvé avec même id et même varnish
    */
    add(id, qty=1) { 
        let storedVarnish = localStorage.getItem("chosenVarnish");
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
    /**
    * Méthode pour ajouter un produit dans le panier quand le produit n'y est pas déjà
    * @param {Object} pdtStorage Objet produit unique stocké dans localStorage
    * @param {String} storedVarnish Option vernis stockée dans localStorage
    * @return {Array} CART.contents Panier du navigateur une fois le produit ajouté
    */
    addFromStorage() {
        //Récupère le produit grâce au localStorage
        let pdtInStorage = localStorage.getItem("storedPdt");
        let pdtSelected = JSON.parse(pdtInStorage);
        //Récupère le vernis choisi grâce au localStorage et l'ajoute au produit
        let storedVarnish = localStorage.getItem("chosenVarnish");
        pdtSelected.varnish = storedVarnish;
        if (pdtSelected) {
           //Ajoute le produit au panier dans le navigateur
            CART.contents.push(pdtSelected);
        }
    },
     /**
    * Méthode pour supprimer un article du panier 
    * @param {String} id Id du produit à supprimer
    * @param {String} varnish Option vernis du produit à supprimer
    * @return {Array} CART.contents Panier du navigateur une fois le produit enlevé
    * @return {Number} count Compteur de l'icône panier
    */
    remove(id, varnish) {
        //Filtre les produits du panier par l'id - on peut obtenir plusieurs produits qui ont le même id mais pas la même option de vernis -
        let filteredCart = CART.contents.filter(item => {
            if (item._id == id) { 
            return true;
           }
        });
        //Filtre les produits obtenus par le vernis, on obtient l'article qui a le même id et le même varnish
        let sameOrder = filteredCart.filter(item => {
            if (item.varnish == varnish) {
                return true;
            }
        });
       //Garde tous les produits du panier qui ne sont pas le produit ci-dessus : revient à le supprimer du panier
        CART.contents = CART.contents.filter(item => {
          if (item !== sameOrder[0]) { 
               return true;
              }
        });
        //Réinitialisation et calcul de l'icône panier
        count = 0;
        if (CART.contents) {
            CART.contents.forEach(content => {
                count += content.quantity;
            });
        } else {
            count = 0;
        }
        //Met à jour le panier dans le localStorage et le prix total
        CART.sync();
        cartAmount.textContent = calculateCartAmount() + " EUR";
        //Affichage de l'icône panier
        setTimeout(function() {
            showCount(); 
        }, 1000);       
     },
};


/**
*Fonction pour ajouter le produit au panier depuis la page produit
* @param {String} id Id du produit récupéré via le "data-id" du bouton
*/
function addItem(e) { // 
    //Récupération de l'id stocké dans le "data-id" du bouton
    let id = e.target.getAttribute("data-id");
    CART.add(id, 1);
}

/**
*Fonction pour supprimer un produit du panier 
* @param {Array} tableau de strings récupéré via le "data-id" du bouton, ayant comme éléments l'id et le varnish du produit
*/
function suppressItem(e) {
    //Récupère l'id et le varnish stockés dans le "data-id" du bouton
    let data = e.target.getAttribute("data-id");
    let id = data.slice(0, 24);
    let varnish = data.slice(25);
    //Gère le cas où l'user n'a pas choisi de finition vernis
    if (varnish =="") {
        varnish = "Standard";
    }
    CART.remove(id, varnish);
    //Actualise le panier
    showCart(); 
}


/**
*Fonction pour afficher le nombre de produits achetés sur l'icône panier
@param {number} storeCount Compteur stocké dans localStorage
*/

async function showCount() {
    // Récupère le compteur dans le localStorage 
    let storedCount = await localStorage.getItem("count");
    cartCount.textContent = JSON.parse(storedCount);
} 
