package com.mapper;

import com.dto.CustomerDto;
import com.dto.IssuanceRequestDto;
import com.model.Customer;
import com.model.IssuanceRequest;

// Class responsible for mapping between DTOs (Data Transfer Objects) and domain model objects
public class Mapper {

    // Method to map Customer entity to CustomerDto
    public static CustomerDto mapToCustomerDto(Customer customer) {
        return new CustomerDto(
                customer.getId(),
                customer.getFirst_name(),
                customer.getLast_name(),
                customer.getEmail());
    }

    // Method to map CustomerDto to Customer entity
    public static Customer maptoCustomer(CustomerDto customerDto) {
        return new Customer(
                customerDto.getId(),
                customerDto.getFirst_name(),
                customerDto.getLast_name(),
                customerDto.getEmail());
    }

    // Method to map IssuanceRequestDto to IssuanceRequest entity
    public static IssuanceRequest maptoIssuanceRequest(IssuanceRequestDto issuanceRequestDto) {
        return new IssuanceRequest(
                null,
                issuanceRequestDto.getInitiator(),
                issuanceRequestDto.getDate(),
                issuanceRequestDto.getToken_id(),
                issuanceRequestDto.getAmount(),
                issuanceRequestDto.getIssuer(),
                issuanceRequestDto.getStatus());
    }

    // Method to map IssuanceRequest entity to IssuanceRequestDto
    public static IssuanceRequestDto maptoIssuanceRequestDto(IssuanceRequest issuanceRequest) {
        return new IssuanceRequestDto(
                issuanceRequest.getId(),
                issuanceRequest.getInitiator(),
                issuanceRequest.getDate(),
                issuanceRequest.getToken_id(),
                issuanceRequest.getAmount(),
                issuanceRequest.getIssuer(),
                issuanceRequest.getStatus());
    }
}
