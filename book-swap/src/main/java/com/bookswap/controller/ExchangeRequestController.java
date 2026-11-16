package com.bookswap.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.bookswap.dto.ExchangeRequestCreateDTO;
import com.bookswap.dto.ExchangeRequestDTO;
import com.bookswap.dto.HandoverDetailsDTO;
import com.bookswap.service.ExchangeRequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/exchange-requests")
public class ExchangeRequestController {

    private final ExchangeRequestService exchangeRequestService;

    public ExchangeRequestController(
            ExchangeRequestService exchangeRequestService) {
        this.exchangeRequestService = exchangeRequestService;
    }

    @PostMapping
    public ResponseEntity<ExchangeRequestDTO> createRequest(
            @Valid @RequestBody ExchangeRequestCreateDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {

        ExchangeRequestDTO response = exchangeRequestService.createRequest(
                userDetails.getUsername(),
                request.getBookId(),
                request.getRequestType(),
                request.getOfferedBookId()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    // Get Sent Request
    @GetMapping("/sent")
    public ResponseEntity<List<ExchangeRequestDTO>> getSentRequests(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                exchangeRequestService.getSentRequests(userDetails.getUsername())
        );
    }

    // Get received request
    @GetMapping("/received")
    public ResponseEntity<List<ExchangeRequestDTO>> getReceivedRequests(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                exchangeRequestService.getReceivedRequests(userDetails.getUsername())
        );
    }
    
    // Accept Request
    @PutMapping("/{requestId}/accept")
    public ResponseEntity<ExchangeRequestDTO> acceptRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                exchangeRequestService.acceptRequest(
                        requestId,
                        userDetails.getUsername()
                )
        );
    }
    
    // Reject request
    @PutMapping("/{requestId}/reject")
    public ResponseEntity<ExchangeRequestDTO> rejectRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                exchangeRequestService.rejectRequest(
                        requestId,
                        userDetails.getUsername()
                )
        );
    }
    
    // Cancel request
    @PutMapping("/{requestId}/cancel")
    public ResponseEntity<ExchangeRequestDTO> cancelRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                exchangeRequestService.cancelRequest(
                        requestId,
                        userDetails.getUsername()
                )
        );
    }
    
    // handover details
    @PutMapping("/{requestId}/handover")
    public ResponseEntity<ExchangeRequestDTO> setHandoverDetails(
            @PathVariable Long requestId,
            @Valid @RequestBody HandoverDetailsDTO handoverDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                exchangeRequestService.setHandoverDetails(
                        requestId,
                        userDetails.getUsername(),
                        handoverDTO.getHandoverMethod(),
                        handoverDTO.getHandoverDetails()
                )
        );
    }
    
    // Confrims handover
    @PutMapping("/{requestId}/confirm-handover")
    public ResponseEntity<ExchangeRequestDTO> confirmHandover(
            @PathVariable Long requestId,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                exchangeRequestService.confirmHandover(
                        requestId,
                        userDetails.getUsername()
                )
        );
    }
}
