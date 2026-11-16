
import axiosInstance from "./axiosInstance";

// Get all books
export const getAllBooks = () => {
    return axiosInstance.get("/books");
};

// Get book by ID
export const getBookById = (id) => {
    return axiosInstance.get(`/books/${id}`);
};


// Create a new book
export const createBook = (bookData) => {
    return axiosInstance.post("/books", bookData);
};

// Update an existing book
export const updateBook = (id, bookData) => {
    return axiosInstance.put(`/books/${id}`, bookData);
};

// Delete a book
export const deleteBook = (id) => {
    return axiosInstance.delete(`/books/${id}`);
};

// Search, filter and sort books
export const searchBooks = (params) => {
    return axiosInstance.get("/books/search", { params });
};
