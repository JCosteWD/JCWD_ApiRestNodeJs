// Récupération de la méthode "Sequelize"
// Ainse que l'objet DataTypes utilisé dans mon fichier model et qui contient les différents types utilisés 
const { Sequelize, DataTypes } = require('sequelize')
let modules = require('./liste-modules')
// Récupération de mon fichier model de module
const moduleModel = require('../models/module')
const userModel = require('../models/user')
const bcrypt = require('bcrypt')

// Mise en place d'une instance de Sequelize pour la création et la connexion à notre bdd 
const sequelize = new Sequelize(
    'catalogueModules',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2'
        },
        logging: true
    }
)

/* sequelize.authenticate()
    .then(_ => console.log('La connexion à la bdd a bien été établie.'))
    .catch(error => console.error(`Impossible de seconnecter à la base de données ${error}`)) */

// J'instanci mon model
const Module = moduleModel(sequelize, DataTypes)
const User = userModel(sequelize, DataTypes)

// Synchronisation de la demande avec la bdd via la méthode "sync"
// {force: true} permet de supprimer la table précédente avant une synchronisation 
    // Utile pendant le dev mais disparaitra à terme
const initDB = () => {
    sequelize.sync({force: true})
    .then(_ => {
        console.log('La bdd catalogueModules a bien été synchronisée.')

        // Ici, et grâce à la méthode ".map", je vais "boucler" l'intégralité de mon fichier "liste-modules.js" et 
            // les envoyer directement en bdd lors du chargement de mon API REST
        modules.map(module => {
            Module.create({
                name: module.name,
                section: module.section,
                quantity: module.quantity,
                picture: module.picture,
                types: module.types
            // la méthode ".create" retourne ou promesse , on peut donc utiliser les méthode "then" et "catch"
            // La méthode ".toJSON" va permettre à sequelize de n'afficher que les données au format JSON 
            }).then(iconAcc => console.log(iconAcc.toJSON()))
        })
        bcrypt.hash('123', 10)
        .then(hash => User.create({ username: 'Morgan', password: hash }))
        .then(user => console.log(user.toJSON()))

        console.log('La bdd à bien été initialisée !')
    })
}

module.exports = {
    initDB, Module, User
}