const { Router } = require("express");
const {
  addTransaction,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactions");

const router = Router();

router.post("/", addTransaction);
router.get("/", getAllTransactions);
router.patch("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
