import React, { useState, useEffect } from 'react';
import BookCard from './bookcard';
import { addBookToFirestore, updateBookInFirestore, uploadImageAndGetURL, fetchBooksFromFirestore } from '../firebase/firebase';
import { getAuth, signOut } from 'firebase/auth';

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', description: '', image: '', section: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBookIndex, setCurrentBookIndex] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const fetchedBooks = await fetchBooksFromFirestore();
        const recommended = fetchedBooks.filter(book => book.section === 'recommended');
        const suggested = fetchedBooks.filter(book => book.section === 'suggested');
        const general = fetchedBooks.filter(book => book.section !== 'recommended' && book.section !== 'suggested');
        setBooks(general);
        setRecommendedBooks(recommended);
        setSuggestedBooks(suggested);
      } catch (error) {
        console.error('Error fetching books: ', error);
      }
    };

    fetchBooks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleAddBook = async () => {
    try {
      let imageURL = '';
      if (imageFile) {
        imageURL = await uploadImageAndGetURL(imageFile);
      }
      const bookWithImage = { ...newBook, image: imageURL };

      const newBookId = await addBookToFirestore(bookWithImage);
      const bookWithId = { ...bookWithImage, id: newBookId };

      switch (newBook.section) {
        case 'recommended':
          setRecommendedBooks([...recommendedBooks, bookWithId]);
          break;
        case 'suggested':
          setSuggestedBooks([...suggestedBooks, bookWithId]);
          break;
        default:
          setBooks([...books, bookWithId]);
      }
      setNewBook({ title: '', author: '', description: '', image: '', section: '' });
      setImageFile(null);
    } catch (error) {
      console.error("Error adding book to Firestore: ", error);
    }
  };

  const handleEditBook = (book, index) => {
    setIsEditing(true);
    setCurrentBookIndex(index);
    setNewBook(book);
  };

  const handleUpdateBook = async () => {
    try {
      let imageURL = newBook.image;
      if (imageFile) {
        imageURL = await uploadImageAndGetURL(imageFile);
      }
      const updatedBook = { ...newBook, image: imageURL };

      await updateBookInFirestore(newBook.id, updatedBook);

      switch (newBook.section) {
        case 'recommended':
          const updatedRecommendedBooks = recommendedBooks.map((book, index) =>
            index === currentBookIndex ? updatedBook : book
          );
          setRecommendedBooks(updatedRecommendedBooks);
          break;
        case 'suggested':
          const updatedSuggestedBooks = suggestedBooks.map((book, index) =>
            index === currentBookIndex ? updatedBook : book
          );
          setSuggestedBooks(updatedSuggestedBooks);
          break;
        default:
          const updatedBooks = books.map((book, index) =>
            index === currentBookIndex ? updatedBook : book
          );
          setBooks(updatedBooks);
      }
      setNewBook({ title: '', author: '', description: '', image: '', section: '' });
      setIsEditing(false);
      setCurrentBookIndex(null);
      setImageFile(null);
    } catch (error) {
      console.error("Error updating book in Firestore: ", error);
    }
  };

  const handleDeleteBook = (index, section) => {
    switch (section) {
      case 'recommended':
        const updatedRecommendedBooks = recommendedBooks.filter((_, i) => i !== index);
        setRecommendedBooks(updatedRecommendedBooks);
        break;
      case 'suggested':
        const updatedSuggestedBooks = suggestedBooks.filter((_, i) => i !== index);
        setSuggestedBooks(updatedSuggestedBooks);
        break;
      default:
        const updatedBooks = books.filter((_, i) => i !== index);
        setBooks(updatedBooks);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="w-full h-64 bg-cover bg-center" style={{ backgroundImage: 'url(https://www.portmoodylibrary.ca/en/news/resources/NewBooks/NewE_Oct13NEWS.jpg' }}>
        <div className="bg-black bg-opacity-50 h-full flex items-center justify-center">
          <h1 className="text-4xl text-white font-bold">Book Collection</h1>
          <button onClick={handleSignOut} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded">
            Sign Out
          </button>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Book List</h2>
          <div className="flex flex-wrap justify-around">
            {books.map((book, index) => (
              <BookCard
                key={index}
                book={book}
                onEdit={() => handleEditBook(book, index)}
                onDelete={() => handleDeleteBook(index, 'books')}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-800 mt-10 mb-6">Add / Edit Book</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newBook.title}
              onChange={handleInputChange}
              className="block w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={newBook.author}
              onChange={handleInputChange}
              className="block w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newBook.description}
              onChange={handleInputChange}
              className="block w-full p-2 mb-4 border rounded"
            />
            <input
              type="file"
              name="imageFile"
              onChange={handleFileChange}
              className="block w-full p-2 mb-4 border rounded"
            />
            <select
              name="section"
              value={newBook.section}
              onChange={handleInputChange}
              className="block w-full p-2 mb-4 border rounded"
            >
              <option value="">Select Section</option>
              <option value="recommended">Recommended</option>
              <option value="suggested">Suggested</option>
            </select>
            {isEditing ? (
              <button onClick={handleUpdateBook} className="bg-blue-500 text-white p-2 rounded">
                Update Book
              </button>
            ) : (
              <button onClick={handleAddBook} className="bg-green-500 text-white p-2 rounded">
                Add Book
              </button>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-800 mt-10 mb-6">Recommended Books</h2>
          <div className="flex flex-wrap justify-around">
            {recommendedBooks.map((book, index) => (
              <BookCard
                key={index}
                book={book}
                onEdit={() => handleEditBook(book, index)}
                onDelete={() => handleDeleteBook(index, 'recommended')}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-800 mt-10 mb-6">Suggested Books</h2>
          <div className="flex flex-wrap justify-around">
            {suggestedBooks.map((book, index) => (
              <BookCard
                key={index}
                book={book}
                onEdit={() => handleEditBook(book, index)}
                onDelete={() => handleDeleteBook(index, 'suggested')}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookPage;
