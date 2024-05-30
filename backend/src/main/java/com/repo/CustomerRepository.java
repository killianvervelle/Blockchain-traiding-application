package com.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.model.Customer;

// Repository interface for managing Customer entities
public interface CustomerRepository extends JpaRepository<Customer, Long> {

}