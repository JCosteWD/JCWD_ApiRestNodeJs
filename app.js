// J'ai commencé par modifier la facon dont mon application sera lancée .
// Pour ce faire il a fallu créer un script "start" dans le fichier package.json
// Attention à bien remodifier mon script lié au "start" une l'installation de nodemon
// OUTIL : Installation de l'extention pour navigateur "JSON Viewer" pour une meilleurs lisibilité
// Installation de "Xampp" pour les bdd SQL

// Installation de la librairie "nodemon" pour le restart automatique du terminal (on utilise bien -dev lors de l'installation)
// Installation de la librairie "morgan" afin de pouvoir récupérer les logs de nos requète automatiquement (on utilise bien -dev lors de l'installation)
// Installation du package "serve-favicon" 
// Insatallation du middleware "body-parser" qui servira au conversion chaine de caractère => JSON (et inversement)
// Installation de la librairie "Sequelize" . ORM (Object-Relational Mappin) permettant la mise en place d'une passerelle entre mon API REST et la bdd SQL
// Installation de la librairie "mariadb" . Celle ci permettra des précisions de connexion à la bdd (Installation à faire avec sequelize !)
// Installation de la librairie "bcrypt" . Celle me permettra d'encrypter mes mdp
// Installation de la librairie "jsonwebtoken" afin de pouvoir générer et fournir nos jetons JWT

// ATTENTION aux modifications apportées sur "package.json" lors du déploiement (par ex "script" + suppression de "morgan")

// Rappel : Lors d'une récupération de projet sans node_modules , un simple "npm install" suffira



/* …or create a new repository on the command line

echo "# JCWD_ApiRestNodeJs" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/JCosteWD/JCWD_ApiRestNodeJs.git
git push -u origin main

…or push an existing repository from the command line

git remote add origin https://github.com/JCosteWD/JCWD_ApiRestNodeJs.git
git branch -M main
git push -u origin main */



// Récupération du package (ou dépendance) "express" préalablement installée (via un "install express --save" dans le terminal)
const express = require('express')

// Récupération du package "morgan"
//const morgan = require('morgan')

// Récupération du package "morgan"
const favicon = require('serve-favicon')

// Récupération du package "body-parser"
const bodyParser = require('body-parser')

// Récupération de sequelize directement via MON fichier dans lequel il a été instancié
const sequelize = require('./src/db/sequelize')

// Je créé une instance d'express afin de pouvoir l'utiliser
// C'est grâce à "express" que mon serveur fonctionnera 
const app = express()
const port = process.env.PORT || 3000

//Avec la méthode ".use" d'express je peux, ici, rattacher un middleware à mon app.js
//Attention : le middleware "morgan" éxige un parametre . Ici on utilise l'option 'dev' 
// Toujours grâce à la méthode ".use" je rattache mon middlware 'body-parser' à mon express
app
    .use(favicon(__dirname + '/favicon.ico'))
    //.use(morgan('dev'))
    .use(bodyParser.json())

sequelize.initDB()

// EndPoint temporaire afin de verifer si le déploiement s'est bien déroulé
app.get('/', (req, res) => {
    res.json('Coucou Render !')
})

// Je placerai ici mes futurs points de terminaison
require('./src/routes/findAllModules')(app)
require('./src/routes/findModulesByPk')(app)
require('./src/routes/createModule')(app)
require('./src/routes/updateModule')(app)
require('./src/routes/deleteModule')(app)
require('./src/routes/login')(app)

// J'ajoute la gestion des erreurs 404
app.use(({res}) => {
    const message = `Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre IRL.`
    res.status(404).json({message})
})
    
// Simple message qui apparaitra dans le terminal lors de la connexion
// Il s'agit juste d'un écoute via la méthode ".listen"
app.listen(port, () => console.log(`Notre application Node est lancée sur : http://localhost:${port}`))

//Installation de "nodemon" avec la précision "-dev" pour préciser que
//                 cette dépendance ne sera active que pendant le developpement 