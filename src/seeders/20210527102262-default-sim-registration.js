"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "SimRegistrations",
      [
        {
          firstName: "Williams",
          middleName: "",
          lastName: "Afiuwka",
          gender: "M",
          dob: "10-08-1995",
          phoneNumber: "07041211447",
          serviceProvider: "MTN",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Williams",
          middleName: "",
          lastName: "Afiuwka",
          gender: "M",
          dob: "10-08-1995",
          phoneNumber: "07011111111",
          serviceProvider: "MTN",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("SimRegistrations", null, {});
  },
};
