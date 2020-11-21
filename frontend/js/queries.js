/**
*Fonction pour récupérer la liste des produits depuis le serveur grâce à une API fetch GET
*/
function getProducts() { 
    //Récupération des données via une API fetch 
    fetch("http://localhost:3000/api/furniture", {mode: "cors"})
        .then(response => response.json())
        .then(response => {
            //Affiche la liste des produits une fois que les données sont chargées
            showProducts(response);
            //Test de vérification de bon fonctionnement
            //console.log(response);
            //CART.init();     
        })
        //Affiche l'erreur si requête ne fonctionne pas
        .catch(error => alert("Erreur : " + error));
}
   

/**
*Fonction pour récupérer un produit précis depuis le serveur - via son id intégré aux paramètres de l'URL - grâce à une API fetch GET ciblée
* @param {string} id 
*/
function getProduct(id) {   
    //Récupère le id contenu dans les paramètres de la page URL
    let url = new URL(window.location.href);
    id = url.searchParams.get("id");
    //Test de vérification de bon fonctionnement
    console.log(id);
    //Récupération des données via une API fetch 
    fetch('http://localhost:3000/api/furniture/' + id , {mode: "cors"})
        .then(response => response.json())
        .then(response => {
            showItem(response);
            //Test de vérification de bon fonctionnement
            console.log(response);
            //Mise à jour du contenu de l'objet produit affiché
            PDTSELECTED.contents = {
                _id : response._id,
                name: response.name,
                price: response.price,
                description: response.description,
                imageUrl: response.imageUrl,
                quantity: 1
            }; 
            //Conservation du produit mis à jour dans le localStorage
            let storedPdt = JSON.stringify(PDTSELECTED.contents);
            localStorage.setItem(PDTSELECTED.KEY, storedPdt);   
         })
        //Affiche l'erreur si requête ne fonctionne pas
        .catch(error => alert("Erreur : " + error));          
    }
     
/**
*Fonction pour envoyer les données du formulaire ainsi que la liste des id des produits commandés via une API fetch POST
@param {string} data 
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
            storeIdName(response); 
        })
        .catch(error => alert("Erreur : " + error));
}
