package com.bookswap.dto;

import java.time.LocalDateTime;

import com.bookswap.enums.ExchangeStatus;
import com.bookswap.enums.HandoverMethod;
import com.bookswap.enums.RequestType;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExchangeRequestDTO {

    private Long id;
    private Long requesterId;
    private String requesterName;
    private Long bookId;
    private String bookTitle;
    private String ownerName;
    private ExchangeStatus status;
    private LocalDateTime createdAt;
    private RequestType requestType;
    private Long offeredBookId;
    private String offeredBookTitle;

    private HandoverMethod handoverMethod;
    private String handoverDetails;
    private boolean requesterConfirmed;
    private boolean ownerConfirmed;
}