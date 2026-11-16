package com.bookswap.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bookswap.entity.Book;
import com.bookswap.enums.BookCategory;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
	@Query("""
		    SELECT b FROM Book b
		    WHERE b.available = true
		    AND (
		        :keyword IS NULL
		        OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
		        OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))
		    )
		    AND (
		        :bookCondition IS NULL
		        OR b.bookCondition = :bookCondition
		    )
		    AND (
			    :category IS NULL
			    OR b.category = :category
			)
		""")
		List<Book> searchAvailableBooks(
		        @Param("keyword") String keyword,
		        @Param("bookCondition") String bookCondition,
		        @Param("category") BookCategory category,
		        Sort sort
		);
}
