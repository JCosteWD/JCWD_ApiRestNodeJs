const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key')

module.exports = (req, res, next) => {
    // Récupération de l'en-tête HTTP (c'est ici que transitera les jeton JWT des utilisateurs)
    const authorizationHeader = req.headers.authorization

    // Vérification si le jeton a bien été fourni
    if(!authorizationHeader) {
        const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez en un dans l'en-tête de la requète`
        return res.status(401).json({ message })
    }

    // Récupération du jeton dans la constante "token"
    const token = authorizationHeader.split(' ')[1]
    // Ensuite , et grâce à la méthode .verify, on vérifie donc si le jeton est valide (en complement de la méthode .sign)
    const decodedToken = jwt.verify(token, privateKey, (error, decodedToken) => {
        if(error) {
            const message = `L'utilisateur n'est pas autorisé à accéder à cette ressource.`
            return res.status(401).json({ message, data: error })
        }
    const userId = decodedToken.userId
    if(req.body.userId && req.body.userId !== userId) {
        const message = `L'identifiant de l'utilisateur est invalide.`
        res.status(401).json({ message })
    }else{
        // ici la méthode next laisse libre court à l'utilisateur si toutes les vérifications précédentes ont étaient franchies
        next()
    }
    })
}