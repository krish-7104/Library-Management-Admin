const express = require("express");
const {
  getBookHandler,
  getAllBooksHandler,
  addBookHandler,
  updateBookHandler,
  deleteBookHandler,
  getCountHandler,
  getBookStatsHandler,
  getPopularBooksHandler,
} = require("../controllers/book.controller.js");
const {
  adminAuthMiddleware,
} = require("../middlewares/adminauth.middleware.js");

const router = express.Router();

router.get("/get-book/:id", getBookHandler);
router.get("/get-books", getAllBooksHandler);
router.get("/count", getCountHandler);
router.post(
  "/add-book",
  adminAuthMiddleware,
  addBookHandler
);
router.patch(
  "/update-book/:id",
  adminAuthMiddleware,
  updateBookHandler
);
router.delete("/delete-book/:id", deleteBookHandler);
router.get("/stats", getBookStatsHandler);
router.get("/popular", getPopularBooksHandler);

module.exports = router;
