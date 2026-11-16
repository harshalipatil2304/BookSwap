
import { Link } from "react-router-dom";

function BookCard({ book, onSelect, isSelected }) {
    return (
        <div
            className={`book-card ${isSelected ? "selected" : ""}`}
            onClick={() => onSelect(book)}
        >
            <div className="book-cover">
                {book.coverImageUrl ? (
                    <img
                        src={book.coverImageUrl}
                        alt={book.title}
                    />
                ) : (
                    <div className="book-cover-placeholder">
                        <span>BOOKSWAP</span>
                        <h3>{book.title}</h3>
                        <p>{book.author}</p>
                    </div>
                )}
            </div>

            <div className="book-card-info">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <span>{book.bookCondition.replace("_", " ")}</span>

                <Link
                    to={`/books/${book.id}`}
                    className="details-link"
                    onClick={(e) => e.stopPropagation()}
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}

export default BookCard;
