module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Task', {
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    statut: {
      type: DataTypes.ENUM('à faire', 'en cours', 'terminée'),
      defaultValue: 'à faire'
    }
  }, {
    timestamps: true
  });
};
