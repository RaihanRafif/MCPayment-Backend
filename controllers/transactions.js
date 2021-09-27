const { Transaction, sequelize } = require("../database/models");

exports.addTransaction = async (req, res, next) => {
  try {
    const { amount, title, status, description, category } = req.body;
    let saldo = 0;

    let dateTime = require("node-datetime");
    let dt = dateTime.create();
    let formatted = dt.format("Y-m-d H:M:S");

    const createdAt = formatted;

    const dateLastTransaction = await Transaction.findAll({
      raw: true,
      attributes: [[sequelize.fn("max", sequelize.col("createdAt")), "max"]],
    });

    const lastTransaction = await Transaction.findOne({
      where: { createdAt: dateLastTransaction[0].max },
    });

    if (lastTransaction) {
      saldo = lastTransaction.saldo;
    }

    if (status == "income") {
      saldo = saldo + parseInt(amount);
    } else {
      saldo = saldo + parseInt(amount) * -1;
    }

    // transaction ? (saldo = saldo + transaction.saldo) : saldo;

    if (!amount || !title || !status || !category) {
      throw new Error("Data is not complete");
    }

    let balanceUpdated = saldo;

    await Transaction.create({
      amount,
      status,
      description,
      category,
      title,
      saldo,
      createdAt,
      balanceUpdated,
    });

    const sumNewSaldo = await Transaction.findAll({
      raw: true,
      attributes: ["amount"],
    });
    // or use arrow functions
    if (sumNewSaldo.length != 0) {
      var sumValues = sumNewSaldo
        .map((item) => item.amount)
        .reduce((prev, next) => prev + next);
    }

    await Transaction.update(
      { balanceUpdated: saldo },
      {
        where: {},
      }
    );

    return res.status(201).json({
      status: "success",
      code: 201,
      message: "Success add new transaction",
      data: balanceUpdated,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.getAllTransactions = async (req, res, next) => {
  try {
    const transaction = await Transaction.findAll();
    const getBalance = await Transaction.findOne({
      order: ["balanceUpdated"],
    });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Success get all Transaction",
      data: {
        balance: getBalance.balanceUpdated,
        transaction,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      throw new Error("Transaction with this id not found.");
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Success delete transaction",
      data: {
        Balance: newBalance,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, amount, description, category, status } = req.body;
    const transaction = await Transaction.findByPk(id);

    let dateTime = require("node-datetime");
    let dt = dateTime.create();
    let formatted = dt.format("Y-m-d H:M:S");

    const updatedAt = formatted;

    if (!transaction) {
      throw new Error("Transaction with this id not found.");
    }

    if (amount) {
      transaction.amount = amount;
    }
    if (title) {
      transaction.title = title;
    }
    if (category) {
      transaction.category = category;
    }
    if (description) {
      transaction.description = description;
    }
    transaction.updatedAt = updatedAt;

    await transaction.save();

    const sumNewSaldo = await Transaction.findAll({
      raw: true,
      attributes: ["amount"],
    });
    // or use arrow functions
    if (sumNewSaldo.length != 0) {
      let sumValues = sumNewSaldo
        .map((item) => item.amount)
        .reduce((prev, next) => prev + next);

      transaction.saldo = sumValues - transaction.amount + amount;
      await transaction.save();
    }
    // or use arrow functions
    await Transaction.update(
      { balanceUpdated: transaction.saldo },
      {
        where: {},
      }
    );

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Success update data",
      data: { balance: transaction.saldo },
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      throw new Error("Transaction with this id not found.");
    }

    const newBalance = transaction.balanceUpdated - transaction.amount;

    await Transaction.destroy({
      where: {
        id,
      },
    });

    await Transaction.update(
      { balanceUpdated: newBalance },
      {
        where: {},
      }
    );
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Success delete transaction",
      data: {
        Balance: newBalance,
      },
    });
  } catch (error) {
    return next(error);
  }
};
