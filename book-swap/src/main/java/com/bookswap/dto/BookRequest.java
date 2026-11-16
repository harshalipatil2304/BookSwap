package com.bookswap.dto;

import com.bookswap.enums.BookCategory;
import com.bookswap.enums.ListingType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class BookRequest {

    @NotBlank(message = "Book title is required")
    private String title;

    @NotBlank(message = "Author name is required")
    private String author;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
    
    @Size(max = 1000, message = "Cover image URL cannot exceed 1000 characters")
    private String coverImageUrl;

    @NotBlank(message = "Book condition is required")
    private String bookCondition;

    @NotNull
    private ListingType listingType;
    
    @NotNull(message = "Book category is required")
    private BookCategory category;
}

