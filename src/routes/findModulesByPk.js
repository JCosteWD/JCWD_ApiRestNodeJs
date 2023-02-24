const { Module } = require('../Db/sequelize')
const auth = require('../Auth/auth')

module.exports = (app) => {
    app.get('/api/components/:id', auth, (req, res) => {
        Module.findByPk(req.params.id)
            .then(module => {
                if(module === null) {
                    const message = 'Le module demandé n\'existe pas. Réessayez avec un autre identifiant.'
                    return res.status(404).json({ message })
                }
                const message = 'Un module a bien été trouvé.'
                res.json({ message, data: module })
            })
            .catch(error => {
                const message = `La liste des modules n'a pas pu être récupérée. Réessayez dans quelques instants.`
                res.status(500).json({ message, data: error })
            })
    })
}