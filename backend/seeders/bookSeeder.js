const mongoose = require("mongoose");
const Book = require("../models/book.model");
const Category = require("../models/category.model");
const dotenv = require("dotenv");
dotenv.config();

const generateBooks = async () => {
  const categories = await Category.find();
  const books = [];

  const bookData = [
    {
      name: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 299,
      stock: 10,
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500",
      categoryName: "Literature",
    },
    {
      name: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 399,
      stock: 8,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
      categoryName: "Literature",
    },
    {
      name: "1984",
      author: "George Orwell",
      price: 349,
      stock: 12,
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
      categoryName: "Fiction",
    },
    {
      name: "The Art of Programming",
      author: "Donald Knuth",
      price: 599,
      stock: 5,
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
      categoryName: "Computer Science",
    },
    {
      name: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      price: 799,
      stock: 7,
      image:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500",
      categoryName: "Computer Science",
    },
    {
      name: "Clean Code",
      author: "Robert C. Martin",
      price: 449,
      stock: 15,
      image:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500",
      categoryName: "Computer Science",
    },
    {
      name: "The Psychology of Money",
      author: "Morgan Housel",
      price: 299,
      stock: 20,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
      categoryName: "Business",
    },
    {
      name: "Atomic Habits",
      author: "James Clear",
      price: 399,
      stock: 18,
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500",
      categoryName: "Self-Help",
    },
    {
      name: "Sapiens",
      author: "Yuval Noah Harari",
      price: 499,
      stock: 9,
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
      categoryName: "History",
    },
    {
      name: "The Alchemist",
      author: "Paulo Coelho",
      price: 249,
      stock: 25,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
      categoryName: "Fiction",
    },
  ];

  // Create a map of category names to their IDs
  const categoryMap = {};
  categories.forEach((category) => {
    categoryMap[category.name] = category._id;
  });

  // Assign books to categories
  for (const book of bookData) {
    const categoryId = categoryMap[book.categoryName];
    if (!categoryId) {
      console.warn(
        `Category "${book.categoryName}" not found for book "${book.name}"`
      );
      continue;
    }

    books.push({
      name: book.name,
      author: book.author,
      price: book.price,
      stock: book.stock,
      image: book.image,
      category: categoryId,
    });
  }

  return books;
};

const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI + "/" + process.env.DB_NAME);
    await Book.deleteMany({});
    const books = await generateBooks();
    const createdBooks = await Book.insertMany(books);
    console.log("Books seeded successfully");

    // Update categories with book references
    for (const book of createdBooks) {
      await Category.findByIdAndUpdate(book.category, {
        $push: { books: book._id },
      });
    }
    console.log("Categories updated with book references");

    return true;
  } catch (error) {
    console.error("Error seeding books:", error);
    throw error;
  }
};

module.exports = seedBooks;
