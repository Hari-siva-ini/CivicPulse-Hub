package com.example.backend.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.complaintEntity;

public interface complaintRepo extends JpaRepository<complaintEntity, Long> {
	List<complaintEntity> findByEmail(String email);
	List<complaintEntity> findByOfficer(String officer);
	Optional findById(Long id);
	
}

