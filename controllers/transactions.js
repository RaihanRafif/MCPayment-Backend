const { Transaction, sequelize } = require("../database/models");

exports.addTransaction = async (req, res, next) => {
  try {
    const { amount, title, status, description, category } = req.body;
    let saldo = 0;

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
      saldo = saldo + amount;
    } else {
      saldo = saldo + amount * -1;
    }

    // transaction ? (saldo = saldo + transaction.saldo) : saldo;

    if (!amount || !title || !status || !description || !category) {
      throw new Error("Data is not complete");
    }

    await Transaction.create({
      amount,
      status,
      description,
      category,
      title,
      saldo,
      balanceUpdated: saldo,
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
      { balanceUpdated: sumValues },
      {
        where: {},
      }
    );

    return res.status(201).json({
      status: "success",
      code: 201,
      message: "Success add new transaction",
      data: saldo,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.getAllTransactions = async (req, res, next) => {
  try {
    const transaction = await Transaction.findAll();

    const sumSaldo = await Transaction.findAll({
      raw: true,
      attributes: ["amount"],
    });

    if (sumSaldo.length != 0) {
      var sumValues = sumSaldo
        .map((item) => item.amount)
        .reduce((prev, next) => prev + next);
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Success get all Transaction",
      data: {
        balance: sumValues,
        transaction,
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

    if (!transaction) {
      throw new Error("Transaction with this id not found.");
    }

    if (title) {
      transaction.title = title;
    }

    await transaction.save();
    const sumNewSaldo = await Transaction.findAll({
      raw: true,
      attributes: ["amount"],
    });
    // or use arrow functions
    if (sumNewSaldo.length != 0) {
      var sumValues = sumNewSaldo
        .map((item) => item.amount)
        .reduce((prev, next) => prev + next);

      transaction.saldo = sumValues - transaction.amount + amount;
      console.log(transaction.saldo);
      await transaction.save();
    }

    const newBalance = await Transaction.findAll({
      raw: true,
      attributes: ["balanceUpdated"],
    });

    newBalance.balanceUpdated = sumValues - transaction.amount + amount;
    newBalance.save();

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Success update data",
      data: { balance: transaction.saldo },
    });
  } catch (error) {
    console.log(error);
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

    await Transaction.destroy({
      where: {
        id,
      },
    });

    const newSaldo = await Transaction.findAll({
      raw: true,
      attributes: ["amount"],
    });

    if (newSaldo.length != 0) {
      var sumValues = newSaldo
        .map((item) => item.amount)
        .reduce((prev, next) => prev + next);
    } else {
      sumValues = 0;
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Success delete transaction",
      data: sumValues,
    });
  } catch (error) {
    return next(error);
  }
};
