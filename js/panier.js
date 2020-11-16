let cartAmount = document.getElementById("cart-amount");

//Lance la mise à jour avec le localStorage et l'affichage du panier, ainsi que le calcul du prix total
document.addEventListener("DOMContentLoaded", () => {
    //Charge les produits du panier
    CART.init();
    //Test de vérification de bon fonctionnement
    CART.logContents();
    //Affiche le panier
    showCart();
    //Calcule le montant total du panier
    cartAmount.textContent = calculateCartAmount() + " EUR";
});


/**
*Fonction pour afficher le panier dans la page panier.html
*/
function showCart() {
    //Capture l'élément du DOM "cart-section" qui va afficher toutes les informations
    let cartSection = document.getElementById("cart-section");
    cartSection.innerHTML = "";
    if (CART.contents.length != 0) {
        //Boucle qui affiche les informations chacun des éléments du tableau CART
        CART.contents.forEach(item => {
            //Crée et ajoute la "case" pour chaque produit du panier
            let cartItem = document.createElement("div");
            cartItem.className = "cartitem";
            cartSection.appendChild(cartItem);
            //Génère et ajoute l'image pour chaque case
            let cartImg = document.createElement("img");
            cartImg.className = "cartitem__img";
            cartImg.alt = item.name;
            cartImg.src = item.imageUrl;
            cartImg.style.width = "10%";
            cartItem.appendChild(cartImg);
            //Génère et ajoute le nom de produit pour chaque case
            let cartTitle = document.createElement("h3");
            cartTitle.textContent = item.name;
            cartTitle.className = "cartitem__title";
            cartItem.appendChild(cartTitle);
            //Génère et ajoute la quantité de produits achetés pour chaque case
            let cartQty = document.createElement("span");
            cartQty.textContent = item.quantity;
            cartQty.className = "cartitem__qty";
            cartItem.appendChild(cartQty);
            //Génère et ajoute le prix total pour chaque case
            let cartPrice = document.createElement("p");
            cartPrice.className = "cartitem__price";
            //Formatage du prix en devise et division pour le transformer en euros 
            let totalPrice = new Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR"}).format(item.price/100 * item.quantity);
            cartPrice.textContent = totalPrice;
            cartItem.appendChild(cartPrice);
            // Généère et ajoute le bouton supprimer
            let cartButton = document.createElement("button");
            cartButton.className = "btn btn-secondary cartitem__button btn__remove";
            cartButton.setAttribute("role", "button");
            cartButton.textContent = "Supprimer du panier";
            cartButton.setAttribute("data-id", item._id);
            cartButton.addEventListener("click", suppressItem);
            cartItem.appendChild(cartButton); 
        });
    } else {
        //Affiche message si le panier est vide
        cartSection.innerHTML = '<h2 id="emptycart">Votre panier est vide.</h2>';
    } 
}

/**
*Fonction pour calculer le montant total du panier en Euros
*/
 function calculateCartAmount() {
    let totalPrice = 0;
    CART.contents.forEach(item => {
       totalPrice += (item.price/100 * item.quantity)
    });
    return totalPrice;
  }

/*init() { : Attention, syntaxe pas acceptée par tous les navigateurs. Syntaxe ancienne init: function() {}
Utiliser Babel pour le transformer en ES5 ??*/


/*Animation pour faire apparaître le formulaire quand on clique sur "termminer la commande"
let buttonConfirm = document.getElementById("confirm");
let formSection = document.getElementById("form-section");
buttonConfirm.addEventListener("click", () => {
   
});
 */            

/*FORMULAIRE */

/*VALIDATION DES DONNEES DU FORMULAIRE EN UTILISANT L'API DE CONTRAINTES DE VALIDATION HTML 5*/

let name = document.getElementById("lastName");
let firstname = document.getElementById("firstName");
let email = document.getElementById("email");
let address = document.getElementById("address");
//let postCode = document.getElementById("postcode");
let city = document.getElementById("city");


name.addEventListener("keyup", function (event) {
  if(name.validity.patternMismatch) {
    name.setCustomValidity("Ceci ne ressemble pas à un nom de famille...");
  } else {
    name.setCustomValidity("");
  }
});
firstname.addEventListener("keyup", function (event) {
  if(firstname.validity.patternMismatch) {
    firstname.setCustomValidity("Ceci ne ressemble pas à un prénom...");
  } else {
    firstname.setCustomValidity("");
  }
});
email.addEventListener("keyup", function (event) {
  if(email.validity.typeMismatch) {
    email.setCustomValidity("Merci d'entrer une adresse email valide utilisant le symbole @");
  } else {
    email.setCustomValidity("");
  }
});
address.addEventListener("keyup", function (event) {
  if(address.validity.patternMismatch) {
    address.setCustomValidity("Merci d'entrer un numéro et le nom de la rue ou avenue");
  } else {
    address.setCustomValidity("");
  }
});
city.addEventListener("keyup", function (event) {
  if(city.validity.patternMismatch) {
    city.setCustomValidity("Ceci ne ressemble pas à un nom de ville...");
  } else {
    city.setCustomValidity("");
  }
});


/* ENVOI DES DONNEES DU FORMULAIRE AVEC UNE FETCH POST*/

/* Mettre tout ce qui est avant dans une fonction qu'on appelle au moment du submit : si tout est ok, on envoie, sinon message d'erreur !!*/

let formElt = document.getElementById("formtosubmit");

//Objet envoyé au serveur
let order = {
   contact: {
      firstName: String,
      lastName: String,
      address: String,
      city: String,
      email: String
      },
   products: [String]
};

//Evenement envoi des données déclenché quand on clique sur le bouton "submit"
formElt.addEventListener("submit", function(e) { 
    // Pour empêcher le formulaire d'envoyer les données par défaut sans validation préalable
    e.preventDefault();
    //Récupération des valeurs entrées par l'utilisateur
    let contact = { 
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value
    };
    //Récupération des données du panier - id des produits commandés - sous forme de tableau de strings
    let products = CART.contents.map(item => item._id);
    console.log(products);//Pour tester bon fonctionnement
    order = {contact, products};
    //Pour tester si ça fonctionne
    console.log("this is the order : ", order);//Pour tester bon fonctionnement
    sendFormData(order);
   // window.location.href = "confirmation.html?price=" + cartAmount.textContent + "";
}); 
    
/**
*Fonction pour envoyer les données du formulaire ainsi que la liste des id des produits commandés via une API fetch POST
@param {string} data - données à envoyer en format json
*/
function sendFormData(data) {   
 fetch("http://localhost:3000/api/furniture/order", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            storeId(response); 
        })
        .catch(error => alert("Erreur : " + error));
}

async function storeId(data) {
    await localStorage.setItem(ORDERID.KEY, data.orderId);
    window.location.href = "confirmation.html?price=" + cartAmount.textContent + "";
}
