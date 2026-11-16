package com.bookswap.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bookswap.entity.ExchangeRequest;
import com.bookswap.enums.ExchangeStatus;

@Repository
public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {
	boolean existsByRequester_IdAndBook_IdAndStatus(
	        Long requesterId,
	        Long bookId,
	        ExchangeStatus status
	);
	
	List<ExchangeRequest> findByRequester_IdOrderByCreatedAtDesc(Long requesterId);
	
	List<ExchangeRequest> findByBook_Owner_IdOrderByCreatedAtDesc(Long ownerId);
	
	Optional<ExchangeRequest> findById(Long id);
	
	List<ExchangeRequest> findByBook_IdAndStatusAndIdNot( Long bookId, ExchangeStatus status, Long requestId);
}
