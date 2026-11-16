
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBookById, getAllBooks } from "../api/bookService";
import { createRequest } from "../api/requestService";
import { useAuth } from "../context/AuthContext";

function BookDetails() {
    const { id } = useParams();
    const { user, isLoggedIn } = useAuth();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [requestType, setRequestType] = useState("GIVE_AWAY");
    const [offeredBookId, setOfferedBookId] = useState("");
    const [myBooks, setMyBooks] = useState([]);
    const [success, setSuccess] = useState("");
    const [requestError, setRequestError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getBookById(id);
                const bookData = response.data;

                setBook(bookData);

                // Set the correct default request type
                setRequestType(
                    bookData.listingType === "EXCHANGE"
                        ? "EXCHANGE"
                        : "GIVE_AWAY"
                );
            } catch (error) {
                setError("Unable to load book details.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id]);

    useEffect(() => {
        const fetchMyBooks = async () => {
            try {
                const response = await getAllBooks();

                const availableBooks = response.data.filter(
                    (book) =>
                        book.ownerId === user?.id &&
                        book.available === true &&
                        book.id !== Number(id)
                );

                setMyBooks(availableBooks);
            } catch (error) {
                console.error("Unable to load your books:", error);
            }
        };

        fetchMyBooks();
    }, [id, user?.id]);

    const validateRequest = () => {
        const errors = {};

        if (!requestType) {
            errors.requestType = "Please select a request type.";
        }

        if (requestType === "EXCHANGE" && !offeredBookId) {
            errors.offeredBookId = "Please select a book to offer.";
        }

        return errors;
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();

        const errors = validateRequest();
        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            setSubmitting(true);
            setRequestError("");
            setSuccess("");

            const requestData = {
                bookId: book.id,
                requestType,
                offeredBookId:
                    requestType === "EXCHANGE"
                        ? Number(offeredBookId)
                        : null
            };

            await createRequest(requestData);

            setSuccess("Your request has been sent successfully!");
            setOfferedBookId("");
        } catch (error) {
            setRequestError(
                error.response?.data?.message ||
                "Unable to send request. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <p>Loading book details...</p>;
    }

    if (error || !book) {
        return <p>{error || "Book not found."}</p>;
    }

    return (
        <main className="book-details-container">

            <div className="book-details-content">

                <div className="book-details-image">
                    {book.coverImageUrl ? (
                        <img
                            src={book.coverImageUrl}
                            alt={book.title}
                        />
                    ) : (
                        <div className="book-cover-placeholder">
                            <span>BOOKSWAP</span>
                            <h2>{book.title}</h2>
                            <p>{book.author}</p>
                        </div>
                    )}
                </div>

                <div className="book-details-info">
                    <span className="book-category">
                        {book.category?.replaceAll("_", " ")}
                    </span>

                    <h1>{book.title}</h1>

                    <h3>By {book.author}</h3>

                    <p className="book-description">
                        {book.description || "No description available."}
                    </p>

                    <div className="book-details-meta">
                        <p>
                            <strong>Condition:</strong>{" "}
                            {book.bookCondition?.replaceAll("_", " ")}
                        </p>

                        <p>
                            <strong>Category:</strong>{" "}
                            {book.category?.replaceAll("_", " ")}
                        </p>

                        <p>
                            <strong>Available for:</strong>{" "}
                            {book.listingType?.replaceAll("_", " ")}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {book.available ? "Available" : "Unavailable"}
                        </p>
                    </div>
                </div>

            </div>

            {book.available && isLoggedIn && book.ownerId !== user?.id && (
                <section className="request-book-section">
                    <h2>Interested in this book?</h2>
                    <p>Send a request to the book owner.</p>

                    <form onSubmit={handleRequestSubmit}>
                        <label>Request Type</label>

                        <select
                            value={requestType}
                            onChange={(e) => {
                                setRequestType(e.target.value);
                                setFieldErrors((previousErrors) => ({
                                    ...previousErrors,
                                    requestType: ""
                                }));
                            }}>
                            {book.listingType !== "GIVE_AWAY" && (
                                <option value="EXCHANGE">Exchange</option>
                            )}

                            {book.listingType !== "EXCHANGE" && (
                                <option value="GIVE_AWAY">Give Away</option>
                            )}
                        </select>
                        {fieldErrors.requestType && ( <p className="field-error">{fieldErrors.requestType}</p>)}

                        {requestType === "EXCHANGE" && (
                            <>
                                <label>Select Your Book to Offer</label>

                                <select
                                    value={offeredBookId}
                                    onChange={(e) => {
                                        setOfferedBookId(e.target.value);
                                        setFieldErrors((previousErrors) => ({
                                            ...previousErrors,
                                            offeredBookId: ""
                                        }));
                                    }}
                                >
                                    <option value="">Select your book</option>

                                    {myBooks.map((myBook) => (
                                        <option
                                            key={myBook.id}
                                            value={myBook.id}
                                        >
                                            {myBook.title}
                                        </option>
                                    ))}
                                </select>
                                {fieldErrors.offeredBookId && (<p className="field-error">{fieldErrors.offeredBookId}</p>)}
                            </>
                        )}

                        {requestError && (
                            <p className="error-message">{requestError}</p>
                        )}

                        {success && (
                            <p className="success-message">{success}</p>
                        )}

                        <button type="submit" disabled={submitting}>
                            {submitting ? "Sending..." : "Send Request"}
                        </button>
                    </form>
                </section>
            )}

            {!book.available && (
                <p className="unavailable-message">
                    This book is no longer available.
                </p>
            )}

            <Link to="/books" className="details-link">
                Back to Books
            </Link>

        </main>
    );
}

export default BookDetails;
