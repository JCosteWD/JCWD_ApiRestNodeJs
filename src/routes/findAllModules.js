const { Module } = require('../db/sequelize')
const { Op } = require('sequelize')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.get('/api/components', auth, (req, res) => {
        if(req.query.name) {
            const name = req.query.name
            const limit = parseInt(req.query.limit) || 2

            if(name.length < 2){
                const message = "Le terme de la recherche doit contenir au moins 2 caractères."
                return res.status(400).json({ message })
            }
            // findAndCountAll remplace findAll et apporte une certain nombre de nouvelles propriétés grâce à sequelize
            return Module.findAndCountAll({
                where: { 
                    name: { // 'name' est la propriété du model de module
                        [Op.like]: `%${name}%` // 'name' est le critère de la recherche
                    }
                },
                // Effectu un tri par ordre croissant 
                order: ['name'],
                // Impose une limite de résultats
                limit: limit,
            })
            // count et rows sont des propriétés fournies par findAndCountAll
            .then(({count, rows}) => {
                const message = `Il y a ${count} modules qui correspondent au terme de recherche ${name}.`
                res.json({ message, data: rows })
            })
        }else {
            Module.findAll({ order: ['name'] })
            .then(modules => {
                const message = 'La liste des modules a bien été récuprée.'
                res.json({ message, data: modules })
        })
        .catch(error => {
            const message = `La liste des modules n'a pas pu être récupérée. Réessayez dans quelques instants.`
            res.status(500).json({ message, data: error })
        })
        }            
    })
}