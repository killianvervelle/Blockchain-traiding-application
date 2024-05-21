package com.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.dto.SupplierDto;
import com.exception.ResourceNotFoundException;
import com.mapper.supplierMapper;
import com.model.Supplier;
import com.repo.SupplierRepository;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SupplierServImpl implements SupplierService {

    private SupplierRepository supplierRepository;

    @Override
    public SupplierDto createsupplier(SupplierDto supplierDto) {
        Supplier supplier = supplierMapper.maptoSupplier(supplierDto);
        Supplier savedSupplier = supplierRepository.save(supplier);
       return supplierMapper.mapToSupplierDto(savedSupplier);
    }

    @Override
    public SupplierDto GetSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("Supplier with given id not found: " + id)
        );
        return supplierMapper.mapToSupplierDto(supplier);
    }

    @Override
    public List<SupplierDto> GetAllSuppliers() {
        List<Supplier> suppliers = supplierRepository.findAll();
        return suppliers.stream()
                        .map((supplier)->supplierMapper.mapToSupplierDto(supplier))
                        .collect(Collectors.toList());
    }

    @Override
    public SupplierDto UpdateSupplierById(Long id, SupplierDto updatedSupplier) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("Supplier with given id not found: " + id)
        );
        supplier.setCompany_name(updatedSupplier.getCompany_name());
        supplier.setEmail(updatedSupplier.getEmail());
        supplierRepository.save(supplier);
        return supplierMapper.mapToSupplierDto(supplier);
    }

    @Override
    public void DeleteSupplierById(Long id) {
        supplierRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("Supplier with given id not found: " + id)
        );
        supplierRepository.deleteById(id);
    }
    
}
