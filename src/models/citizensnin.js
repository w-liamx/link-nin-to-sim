"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CitizensNin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CitizensNin.hasOne(models.Wallet, {
        as: "wallet",
        onDelete: "CASCADE",
        hooks: true,
        foreignKey: {
          name: "citizenId",
          allowNull: false,
        },
      });
    }
  }
  CitizensNin.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      middleName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      trackingId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nin: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "CitizensNin",
    }
  );
  return CitizensNin;
};
