package com.bookswap.entity;

import java.time.LocalDateTime;

import com.bookswap.enums.BookCategory;
import com.bookswap.enums.ListingType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(length = 1000)
    private String description;
    
    @Column(length = 1000)
    private String coverImageUrl;

    private String bookCondition;

    private boolean available = true;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingType listingType = ListingType.EXCHANGE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookCategory category = BookCategory.OTHER;
}

