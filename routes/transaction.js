const { Router } = require("express");
const {
  addTransaction,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionById,
} = require("../controllers/transactions");

const router = Router();

router.post("/", addTransaction);
router.get("/", getAllTransactions);
router.get("/:id", getTransactionById);
router.patch("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
