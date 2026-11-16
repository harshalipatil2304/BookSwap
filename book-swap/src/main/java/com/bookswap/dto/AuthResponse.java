package com.bookswap.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String token;
}
