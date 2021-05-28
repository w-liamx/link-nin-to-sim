"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RequestsReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //
    }
  }
  RequestsReport.init(
    {
      nin: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      phoneNumber: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM("success", "fail"),
      },
      amountBilled: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      remark: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "RequestsReport",
    }
  );
  return RequestsReport;
};
