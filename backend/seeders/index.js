const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const seedCategories = require("./categorySeeder");
const seedBooks = require("./bookSeeder");
const seedUsers = require("./userSeeder");
const seedAdmins = require("./adminSeeder");
const seedAllotments = require("./allotmentSeeder");

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI + "/" + process.env.DB_NAME);
    console.log("Connected to MongoDB");

    // First create categories
    await seedCategories();

    // Then create books (which will use the category IDs)
    await seedBooks();

    // Create admins
    await seedAdmins();

    // Create users
    await seedUsers();

    // Create allotments
    await seedAllotments();

    console.log("All seeders completed successfully");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error running seeders:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAll();
