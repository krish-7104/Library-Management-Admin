const mongoose = require("mongoose");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const generateUsers = async () => {
  const users = [];
  const genders = ["Male", "Female", "Others"];
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash("password123", saltRounds);

  for (let i = 1; i <= 50; i++) {
    const user = {
      name: `Student ${i}`,
      email: `student${i}@example.com`,
      password: hashedPassword,
      phonenumber: 9000000000 + i,
      enrollmentno: 2023000 + i,
      gender: genders[Math.floor(Math.random() * genders.length)],
      fine: Math.floor(Math.random() * 500),
      bookSlot: 5,
    };
    users.push(user);
  }

  return users;
};

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI + "/" + process.env.DB_NAME);
    await User.deleteMany({});
    const users = await generateUsers();
    await User.insertMany(users);
    console.log("Users seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
};

module.exports = seedUsers;
