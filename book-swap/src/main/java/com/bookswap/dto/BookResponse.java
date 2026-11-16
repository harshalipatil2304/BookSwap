package com.bookswap.dto;

import java.time.LocalDateTime;

import com.bookswap.enums.BookCategory;
import com.bookswap.enums.ListingType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {

    private Long id;
    private String title;
    private String author;
    private String description;
    private String coverImageUrl;
    private String bookCondition;
    private boolean available;
    private LocalDateTime createdAt;
    private Long ownerId;
    private String ownerName;
    private ListingType listingType;
    private BookCategory category;

}

