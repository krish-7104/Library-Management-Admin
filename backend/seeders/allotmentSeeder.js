const mongoose = require("mongoose");
const Allotment = require("../models/allotment.model");
const User = require("../models/user.model");
const Book = require("../models/book.model");
const dotenv = require("dotenv");
dotenv.config();

const generateAllotments = async () => {
  const users = await User.find();
  const books = await Book.find();
  const allotments = [];

  // Generate 100 allotments
  for (let i = 0; i < 100; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomBook = books[Math.floor(Math.random() * books.length)];

    // Randomly decide if the book is returned
    const isReturned = Math.random() > 0.3;

    // Generate a random issue date within the last 6 months
    const issueDate = new Date();
    issueDate.setMonth(issueDate.getMonth() - Math.floor(Math.random() * 6));

    // Calculate return date (15 days from issue date)
    const returnDate = new Date(issueDate);
    returnDate.setDate(returnDate.getDate() + 15);

    // If book is returned, set return date to a random date between issue date and now
    const actualReturnDate = isReturned
      ? new Date(
          issueDate.getTime() +
            Math.random() * (Date.now() - issueDate.getTime())
        )
      : null;

    const allotment = {
      user: randomUser._id,
      book: randomBook._id,
      returnDate: returnDate,
      returned: isReturned,
      createdAt: issueDate,
      updatedAt: actualReturnDate || issueDate,
    };

    allotments.push(allotment);
  }

  return allotments;
};

const seedAllotments = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI + "/" + process.env.DB_NAME);
    await Allotment.deleteMany({});
    const allotments = await generateAllotments();
    await Allotment.insertMany(allotments);
    console.log("Allotments seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding allotments:", error);
    throw error;
  }
};

module.exports = seedAllotments;
