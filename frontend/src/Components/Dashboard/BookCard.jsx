import React from "react";

const BookCard = ({ book }) => {
  return (
    <div className="overflow-hidden rounded-lg group shadow transition hover:shadow-md cursor-pointer bg-white">
      <img
        alt="Office"
        src={book.image}
        className="h-56 w-full hover:object-contain object-cover"
      />
      <div className="bg-white p-3">
        <h3 className="mt-2 text-gray-900 font-semibold flex-grow line-clamp-2">
          {book.name}
        </h3>
        <p className="font-medium text-sm/relaxed text-gray-500 mt-1">
          {book.author}
        </p>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm/relaxed text-gray-500">{book.category.name}</p>
          <p className="text-sm/relaxed text-gray-500">Stock: {book.stock}</p>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
