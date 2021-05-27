"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("CitizensNins", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      middleName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      trackingId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nin: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("CitizensNins");
  },
};
