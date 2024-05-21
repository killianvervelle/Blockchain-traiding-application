package com.service;

import java.util.List;

import com.dto.CustomerDto;

public interface CustomerService {
    CustomerDto createcustomer(CustomerDto customerDto);
    CustomerDto GetCustomerById(Long id);
    List<CustomerDto> GetAllCustomers();
    CustomerDto UpdateCustomerById(Long id, CustomerDto updatedCustomer);
    void DeleteCustomerById(Long id);
    List<List<String>> GetUserData(String email);
}
