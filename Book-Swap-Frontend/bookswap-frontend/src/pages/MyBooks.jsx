import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBook, getAllBooks } from "../api/bookService";
import { useAuth } from "../context/AuthContext";

function MyBooks() {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // // Temporary user ID until authentication is implemented
    // const ownerId = 1;

    useEffect(() => {
        const fetchMyBooks = async () => {
            try {
                const response = await getAllBooks();
            
                const myBooks = response.data.filter(
                    (book) => book.ownerId === user.id
                );

                setBooks(myBooks);
            } catch (error) {
                setError("Unable to load your books.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyBooks();
    }, [user.id]);

    const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
        return;
    }

    try {
            await deleteBook(bookId);

            setBooks((previousBooks) =>
                previousBooks.filter((book) => book.id !== bookId)
            );
        } catch (error) {
            setError(
                error.response?.data?.message || "Unable to delete book."
            );
        }
    };

    
    if (loading) return <p>Loading your books...</p>;

    if (error) return <p>{error}</p>;

    return (
        <div className="my-books-container">
            <h1>My Books</h1>
            <p>Manage the books you have shared with the community.</p>

            <Link to="/add-book">+ Add New Book</Link>

            {books.length === 0 ? (
                <p>You haven't added any books yet.</p>
            ) : (
                <div className="my-books-grid">
                    {books.map((book) => (
                        <div className="my-book-card" key={book.id}>
                            <h3>{book.title}</h3>
                            <p>{book.author}</p>
                            <span>{book.bookCondition?.replace("_", " ")}</span>

                            <Link to={`/books/${book.id}`}>    View Details   </Link>
                            <Link to={`/edit-book/${book.id}`}>    Edit Book   </Link>
                            <button className="delete-book-btn" onClick={() => handleDelete(book.id)}>   Delete Book </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyBooks;