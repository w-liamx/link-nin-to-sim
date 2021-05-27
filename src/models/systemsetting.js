"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SystemSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //
    }
  }
  SystemSetting.init(
    {
      key: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      value: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "SystemSetting",
    }
  );
  return SystemSetting;
};
