package com.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.model.IssuanceRequest;

// Repository interface for managing IssuanceRequest entities
public interface IssuanceRequestRepository extends JpaRepository<IssuanceRequest, Long> {

}