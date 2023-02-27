const validTypes = ['btn','img','txt']

// Pour notre model nous faisons dons appel à la librairie sequelize (directement mise en paramètre du module)
// Le second paramètre "DataTypes" nous permettra d'apporter des précisions directement dans notre model (STRING , INTEGER ...)
module.exports = (sequelize, DataTypes) => {
    // On utilise la méthode "define" de la librairie sequelize , qui permettra la déclaration du model ci-dessous auprès de sequelize
    // La méthode "define" va demander 3 paramètres . 
        // 1er paramètre : le nom du model (ici 'Module')
    return sequelize.define('Module', {
        // 2eme paramètres : La description du model
            // la propriété "allowNull" est présente pour stipuler si la description est facultative ou non
        id: {
            type: DataTypes.INTEGER,
            // Cette propriété précise que cet id sera la clé primaire de la table
            primaryKey: true,
            // "autoIncrement" va servir à garantir l'unicité de chaque module
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: 'Le nom est déjà pris.'},
            validate: {
                notEmpty: {
                    msg: 'Le champ du nom ne peut rester vide'},
                notNull: { msg: 'Le nom du module est une propriété requise.' }
            }
        },
        section: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Le champ de la section ne peut rester vide'},
                notNull: { msg: 'Le nom de la section est une propriété requise.' }
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: { msg : 'Utlisez uniquement des nombres entiers définir la quantité.' },
                min: {
                    args: [0],
                    msg: 'Prière de ne peut mettre d\'informations négative.'
                },
                max: {
                    args: [15],
                    msg: 'Cette application ne peut accueillir plus de 15 modules de ce type.'
                },
                notNull: { msg: 'La quantité est une propriété requise.' },
            }
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: { msg : 'Attention ce champ doit contenir une URL valide' },
                notNull: { msg: 'La présence d\'une image liée au module est une propriété requise.' }
            }
        },
        types: {
            type: DataTypes.STRING,
            allowNull: false,
            // Mise en place d'un "getter"(de sequelize) pour la convertion de chaines de caractère issue de la bdd en tableau au format JSON pour l'API REST (tableau)
            get() {
                return this.getDataValue('types').split(',')
            },
            // Mise en place d'un "setter"(de sequelize) pour la convertion du format JSON (tableau) issue de mon API REST en chaines de caractère pour la bdd
            set(types) {
                this.setDataValue('types', types.join())
            },
            validate: {
                isTypesValid(value) {
                    if(!value) {
                        throw new Error('Un module doit avoir au moins un type')
                    }
                    if(value.split(',').length > 2) {
                        throw new Error('Un module ne peut pas avoir plus de 2 types')
                    }
                    value.split(',').forEach(type => {
                        if(!validTypes.includes(type)){
                            throw new Error(`Le type choisi pour le module doit correspondre à un élément de la liste suivante : ${validTypes}`)
                        }
                    })
                }
            }
        }
    }, {
        // 3eme paramètre : Celui est une option de paramètrage global(et facultatif) offrant la possibilité d'apporter d'avantage de précisions
        // "timestamps: true" me permet simplement la modification des options qui suivent
        timestamps: true,
        // "createdAt" va apporter la date de creation pour une nouvelle instance du model
        // sequelize offre suffisement de souplesse pour nous permettre de renommer cette option (ici simplement en 'created')
        createdAt: 'created',
        // Idem pour "updatedAt" mais concernant la date de modification d'un module 
        updateAt: false
    })
}