"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "CitizensNins",
      [
        {
          firstName: "Williams",
          middleName: "",
          lastName: "Afiuwka",
          gender: "M",
          trackingId: "hjYT764HJjas",
          nin: "93056152233",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("CitizensNins", null, {});
  },
};
