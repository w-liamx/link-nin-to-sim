"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Wallets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nin: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "CitizensNins",
          key: "nin",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      balance: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("Wallets");
  },
};
