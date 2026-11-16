package com.bookswap.dto;

import com.bookswap.enums.HandoverMethod;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HandoverDetailsDTO {

    @NotNull(message = "Please select a handover method")
    private HandoverMethod handoverMethod;

    @NotBlank(message = "Handover details are required")
    private String handoverDetails;
}
