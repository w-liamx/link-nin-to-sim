"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SimRegistration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //
    }
  }

  SimRegistration.init(
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
      dob: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      serviceProvider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      nin: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "SimRegistration",
    }
  );
  return SimRegistration;
};
