const { Module } = require('../Db/sequelize')
const { ValidationError } = require('sequelize')
const auth = require('../Auth/auth')

module.exports = (app) => {
    app.post('/api/components', auth, (req, res) => {
        Module.create(req.body)
            .then(module => {
                const message = `Le module ${req.body.name} a bien été créé.`
                res.json({ message, data: module })
        })
        .catch(error => {
            if(error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            if(error instanceof UniqueConstraintError){
                return res.status(400).json({ message: error.message, data: error })
            }
            const message = `La liste des modules n'a pas pu être récupérée. Réessayez dans quelques instants.`
            res.status(500).json({ message, data: error })
        })
    })
}