const ApiResponse = require("../utils/ApiResponse.js");
const Book = require("../models/book.model.js");
const Category = require("../models/category.model.js");
const Allotment = require("../models/allotment.model.js");

const getBookHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res
        .status(404)
        .json(new ApiResponse(404, [], "No Book Found In Database!"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, book, "Book Found Successfully!"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, [], "Internal Server Error"));
  }
};

const getCountHandler = async (req, res) => {
  try {
    const book = await Book.countDocuments();
    return res
      .status(200)
      .json(new ApiResponse(200, book, "Book Count Found!"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, [], "Internal Server Error"));
  }
};

const getAllBooksHandler = async (req, res) => {
  try {
    const { limit, page, search, stock } = req.query;
    const options = {
      limit: limit || 10,
      skip: (page - 1) * 10 || 0,
    };
    const searchCondition = {};

    if (search) {
      searchCondition.name = { $regex: new RegExp(search, "i") };
    }

    if (stock) {
      searchCondition.stock = { $gt: 0 };
    }

    let books;
    if (limit) {
      books = await Book.find({})
        .sort({ createdAt: -1 })
        .find(searchCondition)
        .skip(options.skip)
        .limit(options.limit)
        .lean();
    }
    books = await Book.find({})
      .sort({ createdAt: -1 })
      .find(searchCondition)
      .populate("category");
    if (!books) {
      return res
        .status(404)
        .json(new ApiResponse(404, [], "No Books Found In Database!"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, books, "All Books Get Successfully!"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, [], "Internal Server Error"));
  }
};
const addBookHandler = async (req, res) => {
  try {
    const { name, image } = req.body;
    
    const book = await Book.findOne({ name });
    if (book) {
      return res
        .status(409)
        .json(new ApiResponse(409, [], "Book With Name Already Exists"));
    }
    
    const newBook = await Book.create({
      ...req.body,
      image: image || "",
    });
    await Category.findByIdAndUpdate(
      req.body.category,
      { $push: { books: newBook._id } },
      { new: true }
    );
    return res.status(201).json(new ApiResponse(201, newBook, "Book Added!"));
  } catch (error) {
    console.log("Add Book Error: ", error);
    return res
      .status(500)
      .json(new ApiResponse(500, [], "Internal Server Error"));
  }
};

const updateBookHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, stock, price, author, image } = req.body;
    
    const updateData = { name, category, stock, price, author };
    
    if (image) {
      updateData.image = image;
    }
    
    const book = await Book.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!book) {
      return res
        .status(404)
        .json(new ApiResponse(404, [], "Book not found"));
    }
    
    return res.status(200).json(new ApiResponse(200, book, "Book Updated!"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, [], "Internal Server Error"));
  }
};

const deleteBookHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    await Book.findByIdAndDelete(id);
    await Category.findByIdAndUpdate(req.body.category, {
      $pop: { books: book._id },
    });
    return res.status(200).json(new ApiResponse(200, [], "Book Deleted!"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, [], "Internal Server Error"));
  }
};

const getBookStatsHandler = async (req, res) => {
  try {
    const bookStats = await Book.aggregate([
      {
        $group: {
          _id: null,
          totalBooks: { $sum: "$stock" },
        },
      },
    ]);

    const issuedStats = await Allotment.aggregate([
      {
        $match: { returned: false },
      },
      {
        $group: {
          _id: "$book",
          issuedCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookInfo",
        },
      },
      {
        $unwind: "$bookInfo",
      },
      {
        $group: {
          _id: "$bookInfo.category",
          totalIssued: { $sum: "$issuedCount" },
        },
      },
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueTodayStats = await Allotment.aggregate([
      {
        $match: {
          returned: false,
          returnDate: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $count: "count",
      },
    ]);

    const overdueStats = await Allotment.aggregate([
      {
        $match: {
          returned: false,
          returnDate: { $lt: today },
        },
      },
      {
        $count: "count",
      },
    ]);

    const nextWeekStats = await Allotment.aggregate([
      {
        $match: {
          returned: false,
          returnDate: {
            $gte: today,
            $lt: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $count: "count",
      },
    ]);

    const activeUsers = await Allotment.aggregate([
      {
        $match: { returned: false },
      },
      {
        $group: {
          _id: "$user",
          activeBooks: { $sum: 1 },
        },
      },
      {
        $sort: { activeBooks: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          name: "$userInfo.name",
          email: "$userInfo.email",
          activeBooks: 1,
        },
      },
    ]);

    const recentReturns = await Allotment.aggregate([
      {
        $match: {
          returned: true,
          returnDate: {
            $gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $sort: { returnDate: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookInfo",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$bookInfo",
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          bookTitle: "$bookInfo.title",
          userName: "$userInfo.name",
          returnDate: 1,
        },
      },
    ]);

    const lowStockBooks = await Book.aggregate([
      {
        $match: {
          stock: { $lt: 5 },
        },
      },
      {
        $project: {
          title: 1,
          stock: 1,
          category: 1,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $project: {
          title: 1,
          stock: 1,
          category: "$categoryInfo.name",
        },
      },
    ]);

    const categoryDemand = await Allotment.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookInfo",
        },
      },
      {
        $unwind: "$bookInfo",
      },
      {
        $group: {
          _id: "$bookInfo.category",
          totalIssues: { $sum: 1 },
        },
      },
      {
        $sort: { totalIssues: -1 },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $project: {
          category: "$categoryInfo.name",
          totalIssues: 1,
        },
      },
    ]);

    const totalBooks = bookStats[0]?.totalBooks || 0;
    const totalIssued = issuedStats.reduce(
      (sum, stat) => sum + stat.totalIssued,
      0
    );
    const availableBooks = totalBooks - totalIssued;

    const availablePercentage =
      totalBooks > 0 ? (availableBooks / totalBooks) * 100 : 0;
    const issuedPercentage =
      totalBooks > 0 ? (totalIssued / totalBooks) * 100 : 0;

    const booksByCategory = await Book.aggregate([
      {
        $group: {
          _id: "$category",
          totalCount: { $sum: "$stock" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $project: {
          category: "$categoryInfo.name",
          totalCount: 1,
        },
      },
    ]);

    const mergedCategoryStats = booksByCategory.map((category) => {
      const issuedStat = issuedStats.find(
        (stat) => stat._id.toString() === category._id.toString()
      );
      const issuedCount = issuedStat?.totalIssued || 0;
      const availableCount = category.totalCount - issuedCount;

      return {
        ...category,
        issuedCount,
        availableCount,
        issuedPercentage:
          category.totalCount > 0
            ? (issuedCount / category.totalCount) * 100
            : 0,
        availablePercentage:
          category.totalCount > 0
            ? (availableCount / category.totalCount) * 100
            : 0,
      };
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalBooks,
          availableBooks,
          issuedBooks: totalIssued,
          availablePercentage: parseFloat(availablePercentage.toFixed(2)),
          issuedPercentage: parseFloat(issuedPercentage.toFixed(2)),
          booksByCategory: mergedCategoryStats,
          dueToday: dueTodayStats[0]?.count || 0,
          overdue: overdueStats[0]?.count || 0,
          dueNextWeek: nextWeekStats[0]?.count || 0,
          lowStockBooks,
          activeUsers,
          recentReturns,
          categoryDemand,
        },
        "Book statistics fetched successfully"
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, [], "Internal Server Error"));
  }
};

const getPopularBooksHandler = async (req, res) => {
  try {
    const popularBooks = await Allotment.aggregate([
      {
        $group: {
          _id: "$book",
          issueCount: { $sum: 1 },
        },
      },
      {
        $sort: { issueCount: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookInfo",
        },
      },
      {
        $unwind: "$bookInfo",
      },
      {
        $project: {
          title: "$bookInfo.title",
          author: "$bookInfo.author",
          issueCount: 1,
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(200, popularBooks, "Popular books fetched successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, [], "Internal Server Error"));
  }
};

module.exports = {
  getBookHandler,
  getAllBooksHandler,
  addBookHandler,
  updateBookHandler,
  deleteBookHandler,
  getCountHandler,
  getBookStatsHandler,
  getPopularBooksHandler,
};
