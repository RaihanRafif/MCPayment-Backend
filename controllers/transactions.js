const { Transaction } = require("../database/models");

exports.addTransaction = async (req, res, next) => {
  try {
    const { amount, title, status, description, category } = req.body;
    if (!amount || !title || !status || !description || !category) {
      throw new Error("Data is not complete");
    }
    await Transaction.create({
      amount,
      status,
      description,
      category,
      title,
    });

    return res.status(201).json({
      status: "success",
      code: 201,
      message: "Success add new transaction",
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllTransactions = async (req, res, next) => {
  try {
    const transaction = await Transaction.findAll();

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Success get all Transaction",
      data: transaction,
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const { id, title, amount, description, category, status } = req.body;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      throw new Error("Transaction with this id not found.");
    }

    await Transaction.update({});
  } catch (error) {}
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Transaction.destroy({
      where: {
        id,
      },
    });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Success delete transaction",
    });
  } catch (error) {
    return next(error);
  }
};
