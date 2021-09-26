const { Model, DataTypes } = require("sequelize");
const connection = require("../connection");

class Transaction extends Model {}
Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    saldo: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  },
  {
    modelName: "Transaction",
    sequelize: connection,
    paranoid: false,
    timestamps: false,
  }
);

module.exports = Transaction;
