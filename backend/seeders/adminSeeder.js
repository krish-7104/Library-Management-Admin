const mongoose = require("mongoose");
const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const generateAdmins = async () => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash("admin123", saltRounds);
  
  const admins = [
    {
      name: "Super Admin",
      email: "superadmin@library.com",
      password: hashedPassword,
      phonenumber: 9876543210,
      role: "Super"
    },
    {
      name: "Normal Admin",
      email: "admin@library.com", 
      password: hashedPassword,
      phonenumber: 9876543211,
      role: "Normal"
    },
    {
      name: "Library Manager",
      email: "manager@library.com",
      password: hashedPassword, 
      phonenumber: 9876543212,
      role: "Normal"
    }
  ];

  return admins;
};

const seedAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI + "/" + process.env.DB_NAME);
    await Admin.deleteMany({});
    const admins = await generateAdmins();
    await Admin.insertMany(admins);
    console.log("Admins seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding admins:", error);
    throw error;
  }
};

module.exports = seedAdmins;
