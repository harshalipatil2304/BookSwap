package com.bookswap.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.bookswap.dto.ExchangeRequestDTO;
import com.bookswap.entity.Book;
import com.bookswap.entity.ExchangeRequest;
import com.bookswap.entity.User;
import com.bookswap.enums.ExchangeStatus;
import com.bookswap.enums.HandoverMethod;
import com.bookswap.enums.ListingType;
import com.bookswap.enums.RequestType;
import com.bookswap.repository.BookRepository;
import com.bookswap.repository.ExchangeRequestRepository;
import com.bookswap.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class ExchangeRequestService {

    private final ExchangeRequestRepository exchangeRequestRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public ExchangeRequestService( ExchangeRequestRepository exchangeRequestRepository,
            UserRepository userRepository,
            BookRepository bookRepository) {

        this.exchangeRequestRepository = exchangeRequestRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }


	private ExchangeRequestDTO convertToDTO(ExchangeRequest request) {
	
	    return new ExchangeRequestDTO(
	            request.getId(),
	            request.getRequester().getId(),
	            request.getRequester().getFullName(),
	            request.getBook().getId(),
	            request.getBook().getTitle(),
	            request.getBook().getOwner().getFullName(),
	            request.getStatus(),
	            request.getCreatedAt(),
	            request.getRequestType(),
	            request.getOfferedBook() != null
	                    ? request.getOfferedBook().getId()
	                    : null,
	            request.getOfferedBook() != null
	                    ? request.getOfferedBook().getTitle()
	                    : null,
	            request.getHandoverMethod(),
	            request.getHandoverDetails(),
	            request.isRequesterConfirmed(),
	            request.isOwnerConfirmed()
	    );
	}

    
	public ExchangeRequestDTO createRequest(String requesterEmail,Long bookId, RequestType requestType, Long offeredBookId) {
    	
		User requester = userRepository.findByEmail(requesterEmail)
    	        .orElseThrow(() -> new ResponseStatusException(
    	                HttpStatus.NOT_FOUND, "Requester not found"));
    	Book requestedBook = bookRepository.findById(bookId)
    	        .orElseThrow(() -> new ResponseStatusException(
    	                HttpStatus.NOT_FOUND, "Book not found"));
    	
    	if (!requestedBook.isAvailable()) {
    	    throw new ResponseStatusException(
    	            HttpStatus.CONFLICT,
    	            "This book is not available for exchange");
    	}
    	
    	if (requester.getId().equals(requestedBook.getOwner().getId())) {
    	    throw new ResponseStatusException(
    	            HttpStatus.BAD_REQUEST,
    	            "You cannot request your own book");
    	}
    	
    	if (requestedBook.getListingType() == ListingType.EXCHANGE
    	        && requestType == RequestType.GIVE_AWAY) {

    	    throw new ResponseStatusException(
    	            HttpStatus.BAD_REQUEST,
    	            "This book is available only for exchange");
    	}

    	if (requestedBook.getListingType() == ListingType.GIVE_AWAY
    	        && requestType == RequestType.EXCHANGE) {

    	    throw new ResponseStatusException(
    	            HttpStatus.BAD_REQUEST,
    	            "This book is available only for giveaway");
    	}
    	
    	if (requestType == RequestType.EXCHANGE && offeredBookId == null) {
    	    throw new ResponseStatusException(
    	            HttpStatus.BAD_REQUEST,
    	            "You must select a book to offer for exchange");
    	}
    	
    	Book offeredBook = null;
    	if (requestType == RequestType.EXCHANGE) {
    	    offeredBook = bookRepository.findById(offeredBookId)
    	            .orElseThrow(() -> new ResponseStatusException(
    	                    HttpStatus.NOT_FOUND,
    	                    "Offered book not found"));
    	}
    	
    	if (offeredBook != null) {
    	    if (!offeredBook.getOwner().getId().equals(requester.getId())) {
    	        throw new ResponseStatusException(
    	                HttpStatus.FORBIDDEN,
    	                "You can only offer your own book");
    	    }
    	}
    	
    	if (offeredBook != null && !offeredBook.isAvailable()) {
    	    throw new ResponseStatusException(
    	            HttpStatus.CONFLICT,
    	            "Your offered book is not available");
    	}
    	
    	boolean alreadyRequested = exchangeRequestRepository
    	        .existsByRequester_IdAndBook_IdAndStatus(
    	                requester.getId(),
    	                bookId,
    	                ExchangeStatus.PENDING
    	        );
    	if (alreadyRequested) {
    	    throw new ResponseStatusException(
    	            HttpStatus.CONFLICT,
    	            "You have already sent a pending request for this book");
    	}
    	
    	ExchangeRequest exchangeRequest = new ExchangeRequest();

    	exchangeRequest.setRequester(requester);
    	exchangeRequest.setBook(requestedBook);
    	exchangeRequest.setRequestType(requestType);
    	exchangeRequest.setOfferedBook(offeredBook);

    	ExchangeRequest savedRequest = exchangeRequestRepository.save(exchangeRequest);

    	return convertToDTO(savedRequest);
    }
    
    
	public List<ExchangeRequestDTO> getSentRequests(String requesterEmail) {

	    User requester = userRepository.findByEmail(requesterEmail)
	            .orElseThrow(() -> new ResponseStatusException(
	                    HttpStatus.NOT_FOUND, "Requester not found"));

	    return exchangeRequestRepository
	            .findByRequester_IdOrderByCreatedAtDesc(requester.getId())
	            .stream()
	            .map(this::convertToDTO)
	            .toList();
	}
    
	public List<ExchangeRequestDTO> getReceivedRequests(String ownerEmail) {

	    User owner = userRepository.findByEmail(ownerEmail)
	            .orElseThrow(() -> new ResponseStatusException(
	                    HttpStatus.NOT_FOUND, "Owner not found"));

	    return exchangeRequestRepository
	            .findByBook_Owner_IdOrderByCreatedAtDesc(owner.getId())
	            .stream()
	            .map(this::convertToDTO)
	            .toList();
	}
    
	private ExchangeRequest getRequestForOwner(
	        Long requestId,
	        String ownerEmail) {

	    User owner = userRepository.findByEmail(ownerEmail)
	            .orElseThrow(() -> new ResponseStatusException(
	                    HttpStatus.NOT_FOUND, "Owner not found"));

	    ExchangeRequest request = exchangeRequestRepository.findById(requestId)
	            .orElseThrow(() -> new ResponseStatusException(
	                    HttpStatus.NOT_FOUND, "Request not found"));

	    if (!request.getBook().getOwner().getId().equals(owner.getId())) {
	        throw new ResponseStatusException(
	                HttpStatus.FORBIDDEN,
	                "You are not allowed to manage this request");
	    }

	    if (request.getStatus() != ExchangeStatus.PENDING) {
	        throw new ResponseStatusException(
	                HttpStatus.CONFLICT,
	                "Only pending requests can be processed");
	    }

	    return request;
	}
    
    @Transactional
    public ExchangeRequestDTO acceptRequest(Long requestId, String ownerEmail) {
        ExchangeRequest request = getRequestForOwner(requestId, ownerEmail);

        request.getBook().setAvailable(false);

        if (request.getOfferedBook() != null) {
            request.getOfferedBook().setAvailable(false);
        }

        request.setStatus(ExchangeStatus.ACCEPTED);
        
        List<ExchangeRequest> otherRequests = exchangeRequestRepository
                        .findByBook_IdAndStatusAndIdNot(
                                request.getBook().getId(),
                                ExchangeStatus.PENDING,
                                requestId);
        otherRequests.forEach(otherRequest ->
                otherRequest.setStatus(ExchangeStatus.REJECTED)
        );

        exchangeRequestRepository.saveAll(otherRequests);
        ExchangeRequest savedRequest = exchangeRequestRepository.save(request);

        return convertToDTO(savedRequest);
    }
    
    // handover Details 
    public ExchangeRequestDTO setHandoverDetails(
            Long requestId,
            String ownerEmail,
            HandoverMethod handoverMethod,
            String handoverDetails) {

        ExchangeRequest request = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Request not found"));

        if (!request.getBook().getOwner().getEmail().equals(ownerEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only the book owner can set handover details");
        }

        if (request.getStatus() != ExchangeStatus.ACCEPTED) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Handover details can only be set for accepted requests");
        }

        if (handoverMethod == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please select a handover method");
        }

        if (handoverDetails == null || handoverDetails.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Handover details are required");
        }

        request.setHandoverMethod(handoverMethod);
        request.setHandoverDetails(handoverDetails.trim());

        return convertToDTO(exchangeRequestRepository.save(request));
    }
    
    // Confrims handover
    @Transactional
    public ExchangeRequestDTO confirmHandover(
            Long requestId,
            String userEmail) {

        ExchangeRequest request = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Request not found"));

        if (request.getStatus() != ExchangeStatus.ACCEPTED) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only accepted requests can be confirmed");
        }

        if (request.getHandoverMethod() == null
                || request.getHandoverDetails() == null
                || request.getHandoverDetails().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Handover details must be set first");
        }

        String requesterEmail = request.getRequester().getEmail();
        String ownerEmail = request.getBook().getOwner().getEmail();

        if (userEmail.equals(requesterEmail)) {
            request.setRequesterConfirmed(true);
        } else if (userEmail.equals(ownerEmail)) {
            request.setOwnerConfirmed(true);
        } else {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not part of this exchange request");
        }

        if (request.isRequesterConfirmed() && request.isOwnerConfirmed()) {

            User originalOwner = request.getBook().getOwner();

            request.getBook().setOwner(request.getRequester());
            request.getBook().setAvailable(true);

            if (request.getRequestType() == RequestType.EXCHANGE) {

                Book offeredBook = request.getOfferedBook();

                offeredBook.setOwner(originalOwner);
                offeredBook.setAvailable(true);
            }

            request.setStatus(ExchangeStatus.COMPLETED);
        }

        return convertToDTO(exchangeRequestRepository.save(request));
    }
    
    
    //reject request
    public ExchangeRequestDTO rejectRequest(Long requestId, String ownerEmail) {
        ExchangeRequest request = getRequestForOwner(requestId, ownerEmail);
        request.setStatus(ExchangeStatus.REJECTED);
        ExchangeRequest savedRequest = exchangeRequestRepository.save(request);

        return convertToDTO(savedRequest);
    }
    
    
    // cancel requests
    public ExchangeRequestDTO cancelRequest(Long requestId, String requesterEmail) {

        ExchangeRequest request = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Request not found"));

        if (!request.getRequester().getEmail().equals(requesterEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only cancel your own requests");
        }

        if (request.getStatus() != ExchangeStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only pending requests can be cancelled");
        }

        request.setStatus(ExchangeStatus.CANCELLED);

        ExchangeRequest savedRequest = exchangeRequestRepository.save(request);

        return convertToDTO(savedRequest);
    }
    
}
