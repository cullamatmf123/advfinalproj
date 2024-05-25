import React from 'react';

const BookCard = ({ book, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-md p-4 m-4 max-w-xs hover:shadow-lg transition-shadow duration-300">
      <img src={book.image} alt={book.title} className="w-full h-48 object-cover rounded-t-lg" />
      <div className="mt-4 text-left">
        <h2 className="text-xl font-bold text-gray-800">{book.title}</h2>
        <h4 className="text-md text-gray-600">{book.author}</h4>
        <p className="text-sm mt-2 text-gray-700">{book.description}</p>
      </div>
      <div className="mt-4 flex justify-between">
        <button onClick={onEdit} className="bg-yellow-500 text-white p-2 rounded">
          Edit
        </button>
        <button onClick={onDelete} className="bg-red-500 text-white p-2 rounded">
          Delete
        </button>
      </div>
    </div>
  );
};

export default BookCard;
