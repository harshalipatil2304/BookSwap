package com.bookswap.entity;

import java.time.LocalDateTime;

import com.bookswap.enums.ExchangeStatus;
import com.bookswap.enums.HandoverMethod;
import com.bookswap.enums.RequestType;

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
@Table(name = "exchange_requests")
public class ExchangeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Enumerated(EnumType.STRING)
    private ExchangeStatus status = ExchangeStatus.PENDING;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestType requestType;

    @ManyToOne
    @JoinColumn(name = "offered_book_id")
    private Book offeredBook;
    
    @Enumerated(EnumType.STRING)
    private HandoverMethod handoverMethod;

    private String handoverDetails;

    @Column(nullable = false)
    private boolean requesterConfirmed = false;

    @Column(nullable = false)
    private boolean ownerConfirmed = false;
}
