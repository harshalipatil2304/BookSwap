package com.bookswap.dto;

import com.bookswap.enums.RequestType;

import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class ExchangeRequestCreateDTO {

    @NotNull
    private Long bookId;

    @NotNull
    private RequestType requestType;

    private Long offeredBookId;
}