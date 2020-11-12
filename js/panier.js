
//let PRODUCTS = [];
let cartAmount = document.getElementById("cart-amount");

// Lance la récupération et l'affichage des produits quand la page se charge
document.addEventListener("DOMContentLoaded", () => {
    CART.init();//Charge les produits du panier
    CART.logContents();// Test pour être sûr que le lien avec localStorage fonctionne
    //CART.find(2); Test pour être sûr que le lien avec localStorage fonctionne
    showCart();
    cartAmount.textContent = calculateCartAmount() + " EUR";
});

function showCart() {//Fonction qui affiche le panier à l'écran
    let cartSection = document.getElementById("cart-section");
    cartSection.innerHTML = "";
    if (CART.contents.length != 0) {
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
        });
    } else {
        cartSection.innerHTML = '<h2 id="emptycart">Votre panier est vide.</h2>';
    } 
}

 function calculateCartAmount() {//Fonction qui calcule le montant total du panier en Euros
    let totalPrice = 0;
    CART.contents.forEach(item => {
       totalPrice += (item.price/100 * item.quantity)
    });
    return totalPrice;
  }

/*
function suppressItem(e) {
    let id = e.target.getAttribute("data-id");
    CART.remove(id);
    console.log("Votre produit a bien été supprimé");//Pour tester le bon fonctionnement
    showCart(); 
}
*/


/*init() { : Attention, syntaxe pas acceptée par tous les navigateurs. Syntaxe ancienne init: function() {}
Utiliser Babel pour le transformer en ES5 ??*/


/*Animation pour faire apparaître le formulaire quand on clique sur "termminer la commande"
let buttonConfirm = document.getElementById("confirm");
let formSection = document.getElementById("form-section");
buttonConfirm.addEventListener("click", () => {
    formSection.innerHTML = '<div class="row"><div class="col-12 jumbotron"><h2>Pour finaliser votre commande, merci de remplir ce formulaire.</h2 class="form__title"><form id="formtosubmit" method="post"><div class="form-group"><label for="firstName">Prénom :</label><input type="text" name="firstName" class="form-control" placeholder="Par ex. Martin" id="firstName" pattern="[a-zA-ZàâæçéèêëîïôœùûüÿÀÂÆÇnÉÈÊËÎÏÔŒÙÛÜŸ-]+" required></div><div class="form-group"><label for="lastName">Nom :</label><input type="text" name="lastName" class="form-control" placeholder="Par ex. Delavigne" id="lastName" pattern="[a-zA-ZàâæçéèêëîïôœùûüÿÀÂÆÇnÉÈÊËÎÏÔŒÙÛÜŸ-]+" required></div><div class="form-group"><label for="address">Adresse :</label><input type="text" class="form-control" placeholder="Par ex. 12 rue Fontaine" id="address" pattern="[#.0-9a-zA-Z\s,-]+" required></div><div class="form-group"><label for="city">Ville :</label><input type="text" class="form-control" placeholder="Par ex. Lyon" id="city" pattern="[a-zA-ZàâæçéèêëîïôœùûüÿÀÂÆÇnÉÈÊËÎÏÔŒÙÛÜŸ-]+" required></div><div class="form-group"><label for="email">Email :</label><input type="email" name="email" class="form-control" placeholder="Par ex. martin.delavigne@gmail.com" id="email" required></div><input type="submit" class="btn btn__order form__btn" value="Valider votre commande"></form></div>';
});
 */            
         

/*FORMULAIRE */

/*VALIDATION DES DONNEES DU FORMULAIRE EN UTILISANT L'API DE CONTRAINTES DE VALIDATION HTML 5*/

/*let name = document.getElementById("lastName");// on a besoin d'attendre que le formulaire soit chargé avant de faire ce code ?
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

/*postCode.addEventListener("keyup", function (event) {
  if(postCode.validity.patternMismatch) {
    postCode.setCustomValidity("Dans un code postal, il n'y a que des chiffres !");
  } else {
    postCode.setCustomValidity(""); // Celui du postcode a l'air de ne pas marcher !!
  }
});

city.addEventListener("keyup", function (event) {
  if(city.validity.patternMismatch) {
    city.setCustomValidity("Ceci ne ressemble pas à un nom de ville...");
  } else {
    city.setCustomValidity("");
  }
});*/

/* ENVOI DES DONNEES DU FORMULAIRE AVEC UNE REQUETE XMLHTTPREQUEST POST*/

let formElt = document.getElementById("formtosubmit");

formElt.addEventListener("submit", function(e) {
    e.preventDefault();
    let contact = new FormData(formElt[0]);
    console.log(contact);// pour tester : pour l'instant renvoie un object vide
    fetch("http://localhost:3000/api/furniture/order", {
        method: "POST",
        body: contact
    })
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(error => alert("Erreur : " + error));
});



/* EXTRAIT BACKEND
exports.orderFurniture = (req, res, next) => {
  if (!req.body.contact ||
    !req.body.contact.firstName ||
    !req.body.contact.lastName ||
    !req.body.contact.address ||
    !req.body.contact.city ||
    !req.body.contact.email ||
    !req.body.products) {
    return res.status(400).send(new Error('Bad request!'));
  }*/
   
/* EN UTILISANT UNE XMLHTTPREQUEST

formElt.addEventListener("submit", function(e) {
    e.preventDefault();
    let formResults = new FormData(formElt);
    let XHR = new XMLHttpRequest();
    XHR.addEventListener("load", function(e) {
            console.log(e.target.responseText);
            console.log("Bravo, tout s'est bien passé");
    });
    XHR.addEventListener("error", function(e) {
            console.log("Oups ! Il y a eu un problème !");
    });
    XHR.open("POST", 'http://localhost:3000/api/furniture/order=1');
    //XHR.setRequestHeader("Content-Type", "application/json");
    XHR.send(formResults);//JSON.stringify(formResults));
});
*/

//Ajouter ensuite les autres données à envoyer au serveur : détails de la commande.









