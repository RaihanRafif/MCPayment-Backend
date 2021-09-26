"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("Transactions", {
      id: {
        type: Sequelize.UUID,
        default: Sequelize.UUIDV4,
        primaryKey: true,
      },
      balanceUpdated: {
        type: Sequelize.INTEGER(),
        allowNull: false,
      },
      saldo: {
        type: Sequelize.INTEGER(),
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER(),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      deletedAt: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Transactions");
  },
};
