package com.mapper;

import com.dto.SupplierDto;
import com.model.Supplier;

public class supplierMapper {
    
    public static SupplierDto mapToSupplierDto(Supplier supplier){
        return new SupplierDto(
            supplier.getId(),
            supplier.getCompany_name(),
            supplier.getEmail()
        );
    }
    
    public static Supplier maptoSupplier(SupplierDto supplierDto){
        return new Supplier(
            supplierDto.getId(),
            supplierDto.getCompany_name(),
            supplierDto.getEmail()
        );
    }
}
