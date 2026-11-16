import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookById, updateBook } from "../api/bookService";

function EditBook() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await getBookById(id);
                setFormData(response.data);
            } catch (error) {
                setError("Unable to load book details.");
            }
        };

        fetchBook();
    }, [id]);

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

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

        setFieldErrors((previousErrors) => ({
            ...previousErrors,
            [name]: validateField(name, value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};
        Object.keys(formData).forEach((name) => {
            errors[name] = validateField(name, formData[name] || "");
        });

        setFieldErrors(errors);

        if (Object.values(errors).some((message) => message !== "")) {
            return;
        }

        try {
            await updateBook(id, formData);
            setSuccess("Book updated successfully!");

            setTimeout(() => {
                navigate("/my-books");
            }, 2000);
        } catch (error) {
            setError(
                error.response?.data?.message || "Unable to update book."
            );
        }
    };

    if (error) return <p>{error}</p>;
    if (!formData) return <p>Loading book details...</p>;

   return (
        <div className="edit-book-container">
            <h1>Edit Book</h1>
            <p>Update your book information.</p>

            <form onSubmit={handleSubmit}>
                <label>Book Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                {fieldErrors.title && ( <p className="field-error">{fieldErrors.title}</p>)}

                <label>Author</label>
                <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                />
                {fieldErrors.author && (<p className="field-error">{fieldErrors.author}</p>)}

                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                />
                {fieldErrors.description && ( <p className="field-error">{fieldErrors.description}</p>)}

                <label>Cover Image URL</label>
                <input
                    type="url"
                    name="coverImageUrl"
                    value={formData.coverImageUrl || ""}
                    onChange={handleChange}
                />
                {fieldErrors.coverImageUrl && ( <p className="field-error">{fieldErrors.coverImageUrl}</p>)}

                <label>Book Condition</label>
                <select
                    name="bookCondition"
                    value={formData.bookCondition}
                    onChange={handleChange}
                    required
                >
                    <option value="NEW">New</option>
                    <option value="LIKE_NEW">Like New</option>
                    <option value="GOOD">Good</option>
                    <option value="ACCEPTABLE">Acceptable</option>
                </select>
                {fieldErrors.bookCondition && ( <p className="field-error">{fieldErrors.bookCondition}</p>)}

                <label>Category</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
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

                <label>Listing Type</label>
                <select
                    name="listingType"
                    value={formData.listingType}
                    onChange={handleChange}
                    required
                >
                    <option value="EXCHANGE">Exchange</option>
                    <option value="GIVE_AWAY">Give Away</option>
                    <option value="BOTH">Exchange or Give Away</option>
                </select>

                {error && <p>{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default EditBook;