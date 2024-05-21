package com.mapper;

import com.dto.CustomerDto;
import com.model.Customer;

public class customerMapper {
    
    public static CustomerDto mapToCustomerDto(Customer customer){
        return new CustomerDto(
            customer.getId(),
            customer.getFirst_name(),
            customer.getLast_name(),
            customer.getEmail()
        );
    }
    
    public static Customer maptoCustomer(CustomerDto customerDto){
        return new Customer(
            customerDto.getId(),
            customerDto.getFirst_name(),
            customerDto.getLast_name(),
            customerDto.getEmail()
        );
    }
}
