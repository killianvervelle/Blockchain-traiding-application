package com.service;
import com.dto.CustomerDto;
import com.dto.IssuanceRequestDto;

import java.util.List;

public interface Services {
    // Customer operations
    CustomerDto createcustomer(CustomerDto customerDto);
    CustomerDto GetCustomerById(Long id);
    List<CustomerDto> GetAllCustomers();
    CustomerDto UpdateCustomerById(Long id, CustomerDto updatedCustomer);
    void DeleteCustomerById(Long id);

    // User data retrieval
    List<List<String>> GetUserData(String email);

    // Issuance request operations
    IssuanceRequestDto RegisterIssuanceRequest(IssuanceRequestDto issuanceRqDto);
    IssuanceRequestDto GetIssuanceRequestStatus(Long id);
    IssuanceRequestDto IssuanceRequestStatusUpdate(Long id, String issuer);
    List<IssuanceRequestDto> GetAllIssuanceRequests();
    List<IssuanceRequestDto> GetAllIssuanceRequestsByIssuer(String issuer);
}
