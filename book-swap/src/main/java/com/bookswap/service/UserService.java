package com.bookswap.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.bookswap.dto.UserResponse;
import com.bookswap.entity.User;
import com.bookswap.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Convert User entity into UserResponse DTO
    private UserResponse convertToDTO(User user) {
        return new UserResponse(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getCity(),
            user.getCreatedAt()
        );
    }

    // Get all users
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // Get user by ID
    public Optional<UserResponse> getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO);
    }

    // Get user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
