package com.bookswap.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.bookswap.dto.BookRequest;
import com.bookswap.dto.BookResponse;
import com.bookswap.entity.Book;
import com.bookswap.entity.User;
import com.bookswap.enums.BookCategory;
import com.bookswap.repository.BookRepository;
import com.bookswap.repository.UserRepository;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public BookService(BookRepository bookRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    // Convert Book entity into BookResponse DTO
    private BookResponse convertToDTO(Book book) {

        return new BookResponse(
            book.getId(),
            book.getTitle(),
            book.getAuthor(),
            book.getDescription(),
            book.getCoverImageUrl(),
            book.getBookCondition(),
            book.isAvailable(),
            book.getCreatedAt(),
            book.getOwner().getId(),
            book.getOwner().getFullName(),
            book.getListingType(),
            book.getCategory()
        );
    }

    // Get all books
    public List<BookResponse> getAllBooks() {

        return bookRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // Get book by ID
    public Optional<BookResponse> getBookById(Long id) {

        return bookRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    // Create a book
 // Create a book
    public BookResponse createBook(BookRequest request, String email) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        Book book = new Book();

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setDescription(request.getDescription());
        book.setCoverImageUrl(request.getCoverImageUrl());
        book.setBookCondition(request.getBookCondition());
        book.setOwner(owner);
        book.setListingType(request.getListingType());
        book.setCategory(request.getCategory());

        Book savedBook = bookRepository.save(book);

        return convertToDTO(savedBook);
    }
    
    // Update a Book
 // Update a Book
    public BookResponse updateBook(Long bookId, BookRequest request, String email) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Book not found"));

        if (!book.getOwner().getId().equals(owner.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "You cannot update this book");
        }

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setDescription(request.getDescription());
        book.setCoverImageUrl(request.getCoverImageUrl());
        book.setBookCondition(request.getBookCondition());
        book.setListingType(request.getListingType());
        book.setCategory(request.getCategory());

        Book updatedBook = bookRepository.save(book);

        return convertToDTO(updatedBook);
    }
    
    
    // Delete a book
    public void deleteBook(Long bookId, String email) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Book not found"));

        if (!book.getOwner().getId().equals(owner.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "You cannot delete this book");
        }

        bookRepository.delete(book);
    }
    
    // Searching
    public List<BookResponse> searchBooks(String keyword, String bookCondition, BookCategory category, String sortBy, String direction) {

    	if (!sortBy.equals("title") && !sortBy.equals("createdAt")) {
    	    throw new ResponseStatusException(
    	            HttpStatus.BAD_REQUEST,
    	            "Invalid sort field. Use title or createdAt."
    	    );
    	}
    	if (!direction.equalsIgnoreCase("asc")
    	        && !direction.equalsIgnoreCase("desc")) {
    	    throw new ResponseStatusException(
    	            HttpStatus.BAD_REQUEST,
    	            "Invalid sort direction. Use asc or desc."
    	    );
    	}
    	
        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        return bookRepository.searchAvailableBooks(
                keyword, bookCondition, category, sort)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }
}
