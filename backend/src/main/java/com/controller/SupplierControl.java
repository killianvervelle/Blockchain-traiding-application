package com.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dto.SupplierDto;
import com.service.SupplierService;
import lombok.AllArgsConstructor;


@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/supplier")
public class SupplierControl {

    private SupplierService supplierService;

    @PostMapping("register")
    public ResponseEntity<SupplierDto> createSupplier(@RequestBody SupplierDto supplierDto){
        SupplierDto savedSupplierDto = supplierService.createsupplier(supplierDto);
        return new ResponseEntity<>(savedSupplierDto, HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<SupplierDto> getSupplierById(@PathVariable("id") Long id) {
        SupplierDto supplierDto = supplierService.GetSupplierById(id);
        return ResponseEntity.ok(supplierDto);
    }

    @GetMapping()
    public ResponseEntity<List<SupplierDto>> getSupplierById() {
        List<SupplierDto> suppliersDto = supplierService.GetAllSuppliers();
        return ResponseEntity.ok(suppliersDto);
    }

    @PutMapping("{id}")
    public ResponseEntity<SupplierDto> updateSupplier(@PathVariable Long id, @RequestBody SupplierDto supplierDto) {
        SupplierDto updatedSupplier = supplierService.UpdateSupplierById(id, supplierDto);
        return ResponseEntity.ok(updatedSupplier);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteSupplier(@PathVariable Long id) {
        supplierService.DeleteSupplierById(id);
        return ResponseEntity.ok("Supplier with given id was successfully deleted: "+id);
    }
}
