
import { useEffect, useState } from "react";
import { createBook } from "../api/bookService";

function AddBook() {
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        description: "",
        coverImageUrl: "",
        bookCondition: "",
        listingType: "EXCHANGE",
        category: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});


    useEffect(() => {
        if (!success) return;

        const timer = setTimeout(() => {
            setSuccess("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [success]);


    const validateField = (name, value) => {
        let message = "";

        if (name === "title" && !value.trim()) {
            message = "Book title is required.";
        }

        if (name === "author" && !value.trim()) {
            message = "Author name is required.";
        }

        if (name === "description" && !value.trim()) {
            message = "Description is required.";
        }

        if (name === "bookCondition" && !value) {
            message = "Please select book condition.";
        }

        if (name === "category" && !value) {
            message = "Please select a category.";
        }

        if (name === "coverImageUrl" && value.trim()) {
            try {
                new URL(value);
            } catch {
                message = "Please enter a valid image URL.";
            }
        }

        return message;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSuccess("");

        setFormData({
            ...formData,
            [name]: value
        });

        setFieldErrors({
            ...fieldErrors,
            [name]: validateField(name, value)
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    Object.keys(formData).forEach((name) => {
        errors[name] = validateField(name, formData[name]);
    });

    setFieldErrors(errors);

    if (Object.values(errors).some((message) => message !== "")) {
        return;
    }

    try {
        setLoading(true);
        setError("");
        setSuccess("");

        // Temporary owner ID until authentication is implemented
        await createBook(formData);

        setSuccess("Book added successfully!");

        setFormData({
            title: "",
            author: "",
            description: "",
            coverImageUrl: "",
            bookCondition: "",
            listingType: "EXCHANGE",
            category: ""
        });

    } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to add book. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="add-book-container">
            <section className="add-book-heading">
                <p className="books-label">GIVE YOUR BOOK A NEW HOME</p>
                <h1>Share a Book</h1>
                <p>List a book and let someone discover a new story.</p>
            </section>

            <form className="add-book-form" onSubmit={handleSubmit}>
                <div>
                    <label>Book Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter book title"
                    />
                    {fieldErrors.title && ( <p className="field-error">{fieldErrors.title}</p>)}
                </div>

                <div>
                    <label>Author</label>
                    <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Enter author name"
                    />
                    {fieldErrors.author && ( <p className="field-error">{fieldErrors.author}</p>)}
                </div>

                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Write a short description"
                    />
                    {fieldErrors.description && (<p className="field-error">{fieldErrors.description}</p>)}
                </div>

                <div>
                    <label>Book Cover Image URL</label>
                    <input type="url" name="coverImageUrl" value={formData.coverImageUrl} onChange={handleChange} placeholder="Paste image URL" />
                    {fieldErrors.coverImageUrl && ( <p className="field-error">{fieldErrors.coverImageUrl}</p>)}
                    {formData.coverImageUrl && (
                        <div className="image-preview">
                            <label>Cover Preview</label>
                            <img src={formData.coverImageUrl} alt="Book cover preview"/>
                        </div>
                    )}
                </div>

                <div>
                    <label>Book Condition</label>
                    <select
                        name="bookCondition"
                        value={formData.bookCondition}
                        onChange={handleChange}
                    >
                        <option value="">Select condition</option>
                        <option value="NEW">New</option>
                        <option value="LIKE_NEW">Like New</option>
                        <option value="GOOD">Good</option>
                        <option value="ACCEPTABLE">Acceptable</option>
                    </select>
                    {fieldErrors.bookCondition && ( <p className="field-error">{fieldErrors.bookCondition}</p>)}
                </div>

                <div>
                    <label>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">Select category</option>
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
                    {fieldErrors.category && (<p className="field-error">{fieldErrors.category}</p>)}
                </div>

                <div>
                    <label>Listing Type</label>
                    <select
                        name="listingType"
                        value={formData.listingType}
                        onChange={handleChange}
                    >
                        <option value="EXCHANGE">Exchange</option>
                        <option value="GIVE_AWAY">Give Away</option>
                        <option value="BOTH">Exchange or Give Away</option>
                    </select>
                </div>

                {error && <p className="form-error">{error}</p>}

                {success && ( <p className="success-message" role="status" aria-live="polite"><span>✓</span> {success}</p>)}

                <button type="submit" className="primary-btn" disabled={loading}>
                    {loading ? "Adding Book..." : "Add Book"}
                </button>
            </form>
        </main>
    );
}

export default AddBook;
