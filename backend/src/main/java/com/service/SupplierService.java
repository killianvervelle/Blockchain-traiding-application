package com.service;

import java.util.List;
import com.dto.SupplierDto;

public interface SupplierService {
    SupplierDto createsupplier(SupplierDto supplierDto);
    SupplierDto GetSupplierById(Long id);
    List<SupplierDto> GetAllSuppliers();
    SupplierDto UpdateSupplierById(Long id, SupplierDto updatedSupplier);
    void DeleteSupplierById(Long id);

    
}