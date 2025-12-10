package com.example.backend.Repository;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.models.userEntity;

public interface UserRepo extends JpaRepository<userEntity, String> {
    userEntity findByEmail(String email);
    boolean existsByEmail(String email);
    List<userEntity> findByRole(String role);
}
