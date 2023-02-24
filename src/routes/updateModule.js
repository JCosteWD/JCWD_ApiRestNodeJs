const { Module } = require('../Db/sequelize')
const { ValidationError } = require('sequelize')
const auth = require('../Auth/auth')

module.exports = (app) => {
    app.put('/api/components/:id', auth, (req, res) => {
        const id = req.params.id
        Module.update(req.body, {
            where: {id: id}
        })
            .then(_ => {
                return Module.findByPk(id).then(module => {
                    if(module === null) {
                        const message = 'Le module demandé n\'existe pas. Réessayez avec un autre identifiant.'
                        return res.status(404).json({ message })
                    }
                    const message = `Le module ${module.name} a bien été modifié.`
                    res.json({ message, data: module })
            })
        })
        .catch(error => {
                if(error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                if(error instanceof UniqueConstraintError){
                    return res.status(400).json({ message: error.message, data: error })
                }
            const message = `Le module n'a pas pu être modifié. Réessayez dans quelques instants.`
            res.status(500).json({ message, data: error })
        })
    })
}