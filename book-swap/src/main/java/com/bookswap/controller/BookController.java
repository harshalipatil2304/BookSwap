package com.bookswap.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.bookswap.dto.BookRequest;
import com.bookswap.dto.BookResponse;
import com.bookswap.enums.BookCategory;
import com.bookswap.service.BookService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // Get all books
    @GetMapping
    public ResponseEntity<List<BookResponse>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    // Get book by ID
    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable Long id) {

        BookResponse book = bookService.getBookById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Book not found"));

        return ResponseEntity.ok(book);
    }

    // Create a book
    @PostMapping
    public ResponseEntity<BookResponse> createBook(
            @Valid @RequestBody BookRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        BookResponse savedBook =
                bookService.createBook(request, userDetails.getUsername());

        return ResponseEntity.status(201).body(savedBook);
    }
    
    // Update a book
    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        BookResponse updatedBook =
                bookService.updateBook(id, request, userDetails.getUsername());

        return ResponseEntity.ok(updatedBook);
    }
    
    // Delete a book
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        bookService.deleteBook(id, userDetails.getUsername());

        return ResponseEntity.noContent().build();
    }
    
    // Search and filter available books
    @GetMapping("/search")
    public ResponseEntity<List<BookResponse>> searchBooks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String bookCondition,
            @RequestParam(required = false) BookCategory category,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        return ResponseEntity.ok(bookService.searchBooks( keyword, bookCondition, category, sortBy, direction));
    }
}
