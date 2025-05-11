const mongoose = require("mongoose");
const Category = require("../models/category.model");
const Book = require("../models/book.model");
const dotenv = require("dotenv");
dotenv.config();

const categories = [
  { name: "Fiction", books: [] },
  { name: "Literature", books: [] },
  { name: "Computer Science", books: [] },
  { name: "Business", books: [] },
  { name: "Self-Help", books: [] },
  { name: "History", books: [] },
  { name: "Science", books: [] },
  { name: "Technology", books: [] },
  { name: "Biography", books: [] },
  { name: "Mathematics", books: [] },
  { name: "Physics", books: [] },
  { name: "Chemistry", books: [] },
  { name: "Biology", books: [] },
  { name: "Philosophy", books: [] },
  { name: "Non-Fiction", books: [] },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI + "/" + process.env.DB_NAME);
    await Category.deleteMany({});
    await Category.insertMany(categories);
    console.log("Categories seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding categories:", error);
    throw error;
  }
};

module.exports = seedCategories;
