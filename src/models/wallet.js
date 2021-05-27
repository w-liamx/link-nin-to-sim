"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Wallet.belongsTo(models.CitizensNin, {
        as: "user",
        onDelete: "CASCADE",
        hooks: true,
        foreignKey: {
          name: "nin",
          allowNull: false,
        },
      });
    }
  }
  Wallet.init(
    {
      nin: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      balance: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Wallet",
    }
  );
  return Wallet;
};
