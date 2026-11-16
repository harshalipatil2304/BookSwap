
import { useEffect, useState } from "react";
import { searchBooks } from "../api/bookService";
import BookCard from "../components/BookCard";
import { Link } from "react-router-dom";

function Books() {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [direction, setDirection] = useState("asc");
    const [bookCondition, setBookCondition] = useState("");

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await searchBooks({});
            setBooks(response.data);
            setSelectedBook(response.data[0] || null);
        } catch (error) {
            setError("Unable to load books. Please try again.");
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (keyword.trim()) params.keyword = keyword.trim();
            if (category) params.category = category;
            if (bookCondition) params.bookCondition = bookCondition;

            if (sortBy) {
                params.sortBy = sortBy;
                params.direction = direction;
            }

            const response = await searchBooks(params);
            setBooks(response.data);
            setSelectedBook(response.data[0] || null);
        } catch (error) {
            setError("Unable to search books. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setKeyword("");
        setCategory("");
        setSortBy("");
        setDirection("asc");
        setBookCondition("");
        setSelectedBook(null);
        fetchBooks();
    };

    return (
        <main className="books-container">
            <section className="books-heading">
                <p className="books-label">YOUR NEXT GREAT READ</p>
                <h1>Explore Books</h1>
                <p>Discover stories, share knowledge, and find your next favourite book.</p>
            </section>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by book title or author..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                    }}
                />

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="FICTION">Fiction</option>
                    <option value="NON_FICTION">Non-Fiction</option>
                    <option value="EDUCATION">Education</option>
                    <option value="COMPETITIVE_EXAMS">Competitive Exams</option>
                    <option value="CHILDREN">Children</option>
                    <option value="SELF_HELP">Self Help</option>
                    <option value="BIOGRAPHY">Biography</option>
                    <option value="BUSINESS">Business</option>
                    <option value="TECHNOLOGY">Technology</option>
                    <option value="OTHER">Other</option>
                </select>

                <select value={bookCondition} onChange={(e) => setBookCondition(e.target.value)}>
                    <option value="">All Conditions</option>
                    <option value="NEW">New</option>
                    <option value="LIKE_NEW">Like New</option>
                    <option value="GOOD">Good</option>
                    <option value="ACCEPTABLE">Acceptable</option>
                </select>

                <select
                    value={`${sortBy}_${direction}`}
                    onChange={(e) => {
                        const [field, order] = e.target.value.split("_");
                        setSortBy(field);
                        setDirection(order);
                    }}
                >
                    <option value="_asc">Default Sorting</option>
                    <option value="title_asc">Title (A-Z)</option>
                    <option value="title_desc">Title (Z-A)</option>
                    <option value="createdAt_desc">Recently Added</option>
                    <option value="createdAt_asc">Oldest First</option>
                </select>

                <button onClick={handleSearch} className="primary-btn">Search</button>
                <button onClick={handleReset} className="reset-btn">Reset Filters</button>
            </div>

            {loading && <p>Loading books...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && books.length === 0 && (
                <p className="empty-books">No books are currently available.</p>
            )}

            {!loading && !error && books.length > 0 && (
                <section className="books-showcase">
                    <div className="books-grid">
                        <div className="books-grid-heading">
                            <h2>Available Books</h2>
                            <span>{books.length} books found</span>
                        </div>

                        <div className="book-list">
                            {books.map((book) => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    onSelect={setSelectedBook}
                                    isSelected={selectedBook?.id === book.id}
                                />
                            ))}
                        </div>
                    </div>

                    {selectedBook && (
                        <aside className="book-preview">
                            <p className="preview-label">SELECTED BOOK</p>

                            <div className="preview-cover">
                                {selectedBook.coverImageUrl ? (
                                    <img
                                        src={selectedBook.coverImageUrl}
                                        alt={selectedBook.title}
                                    />
                                ) : (
                                    <div className="book-cover-placeholder">
                                        <span>BOOKSWAP</span>
                                        <h2>{selectedBook.title}</h2>
                                        <p>{selectedBook.author}</p>
                                    </div>
                                )}
                            </div>

                            <h2>{selectedBook.title}</h2>
                            <p className="preview-author">by {selectedBook.author}</p>

                            <div className="preview-meta">
                                <p><strong>Condition:</strong> {selectedBook.bookCondition.replace("_", " ")}</p>
                                <p><strong>Category:</strong> {selectedBook.category.replace("_", " ")}</p>
                                <p><strong>Listing:</strong> {selectedBook.listingType.replace("_", " ")}</p>
                            </div>

                            <Link
                                to={`/books/${selectedBook.id}`}
                                className="preview-button"
                            >
                                View Book Details
                            </Link>
                        </aside>
                    )}
                </section>
            )}
        </main>
    );
}

export default Books;
