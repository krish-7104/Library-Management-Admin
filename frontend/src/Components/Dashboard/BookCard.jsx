import React from "react";
import { useNavigate } from "react-router-dom";
import { TbEdit } from "react-icons/tb";

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  return (
    <div className="overflow-hidden rounded-lg group shadow transition-all  hover:shadow-md cursor-pointer bg-white relative">
      <div className="flex-grow opacity-0 h-full w-full absolute group-hover:opacity-100 transition">
        <div
          className="bg-violet-600 hover:bg-violet-800 p-3 text-white rounded-2xl inline-block ml-auto absolute right-6 top-3"
          onClick={() => navigate(`/dashboard/edit-book/${book._id}`)}
        >
          <TbEdit />
        </div>
      </div>
      <img
        alt="Office"
        src={book.image}
        className="h-56 w-full object-contain"
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
