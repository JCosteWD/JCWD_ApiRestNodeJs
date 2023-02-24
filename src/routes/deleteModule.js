const { Module } = require('../Db/sequelize')
const auth = require('../Auth/auth')

module.exports = (app) => {
    app.delete('/api/components/:id', auth, (req, res) => {
        Module.findByPk(req.params.id).then(module => {
            if(module === null) {
                const message = 'Le module demandé n\'existe pas. Réessayez avec un autre identifiant.'
                return res.status(404).json({ message })
            }
        const moduleDelete = module
        return Module.destroy({
            where: {id: module.id}
        })
            .then(_ => {
                    const message = `Le module ${module.name} a bien été supprimé.`
                    res.json({ message, data: moduleDelete })
            })
        })
        .catch(error => {
            const message = `Le module n'a pas pu être supprimé. Réessayez dans quelques instants.`
            res.status(500).json({ message, data: error })
        })
    })
}