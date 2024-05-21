package com.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.model.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

}