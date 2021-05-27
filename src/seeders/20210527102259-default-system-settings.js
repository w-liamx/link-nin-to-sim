"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "SystemSettings",
      [
        {
          key: "chargePerRequest",
          value: 500,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          key: "usersStartingBalance",
          value: 2000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("SystemSettings", null, {});
  },
};
