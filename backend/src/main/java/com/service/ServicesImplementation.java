package com.service;

import com.dto.CustomerDto;
import com.dto.IssuanceRequestDto;
import com.exception.ResourceNotFoundException;
import com.mapper.Mapper;
import com.model.Customer;
import com.model.IssuanceRequest;
import com.repo.CustomerRepository;
import com.repo.IssuanceRequestRepository;

import java.util.List;
import java.security.Key;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.AllArgsConstructor;

// Service implementation class that implements the Services interface
@Service
@AllArgsConstructor
public class ServicesImplementation implements Services {

    private CustomerRepository customerRepository;

    private IssuanceRequestRepository issuanceRequestRepository;

    private JDBCService jdbcService;

    @Autowired
    private Keystore keystore;

    // Method to create a new customer
    @Override
    public CustomerDto createcustomer(CustomerDto customerDto) {
        Customer customer = Mapper.maptoCustomer(customerDto);
        List<String> attribute_list = jdbcService.extractColumnContent("email");
        if (attribute_list.contains(customerDto.getEmail())) {
            throw new RuntimeException("Account is already registered with this email.");
        }
        Customer savedCustomer = customerRepository.save(customer);
        return Mapper.mapToCustomerDto(savedCustomer);
    }

    // Method to get a customer by their ID
    @Override
    public CustomerDto GetCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee with given id does not exist: " + id));
        return Mapper.mapToCustomerDto((customer));
    }

    // Method to get all customers
    @Override
    public List<CustomerDto> GetAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream()
                .map((customer) -> Mapper.mapToCustomerDto(customer))
                .collect(Collectors.toList());
    }

    // Method to update a customer by their ID
    @Override
    public CustomerDto UpdateCustomerById(Long id, CustomerDto updatedCustomer) {
        Customer customer = customerRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Employee with given id not found: " + id));
        customer.setFirst_name(updatedCustomer.getFirst_name());
        customer.setLast_name(updatedCustomer.getLast_name());
        customer.setEmail(updatedCustomer.getEmail());
        Customer updatedCustomerObj = customerRepository.save(customer);
        return Mapper.mapToCustomerDto(updatedCustomerObj);
    }

    // Method to delete a customer by their ID
    @Override
    public void DeleteCustomerById(Long id) {
        customerRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Employee with given id not found: " + id));
        customerRepository.deleteById(id);
    }

    // Method to get user data based on email using JDBCService
    @Override
    public List<List<String>> GetUserData(String email) {
        return jdbcService.getUserData(email);
    }

    // Method to register an issuance request
    @Override
    public IssuanceRequestDto RegisterIssuanceRequest(IssuanceRequestDto issuanceRequestDto) {
        try {
            Key key = keystore.getCurrentKey();
            IssuanceRequest issuanceRequest = Mapper.maptoIssuanceRequest(issuanceRequestDto);
            String initiator = issuanceRequest.getInitiator();
            String amount = issuanceRequest.getAmount();
            String encryptedInitiator = AESEncryption.encrypt(initiator, key);
            String encryptedAmount = AESEncryption.encrypt(amount, key);
            issuanceRequest.setInitiator(encryptedInitiator);
            issuanceRequest.setAmount(encryptedAmount);
            IssuanceRequest savedIssuanceRequest = issuanceRequestRepository.save(issuanceRequest);
            IssuanceRequestDto savedIssuanceRequestDto = Mapper.maptoIssuanceRequestDto(savedIssuanceRequest);
            return savedIssuanceRequestDto;
        } catch (Exception e) {
            e.printStackTrace();
            return new IssuanceRequestDto();
        }
    }

    // Method to get all issuance requests
    @Override
    public List<IssuanceRequestDto> GetAllIssuanceRequests() {
        List<IssuanceRequest> ListIssuanceRequest = issuanceRequestRepository.findAll();
        Key key = keystore.getCurrentKey();
        return ListIssuanceRequest.stream()
                .filter(issuanceRequest -> "Open".equals(issuanceRequest.getStatus()))
                .map((issuanceRequest) -> Mapper.maptoIssuanceRequestDto(issuanceRequest))
                .peek(issuanceRequest -> {
                    try {
                        String decryptedInitiator = AESEncryption.decrypt(issuanceRequest.getInitiator(), key);
                        String decryptedAmount = AESEncryption.decrypt(issuanceRequest.getAmount(), key);
                        issuanceRequest.setInitiator(decryptedInitiator);
                        issuanceRequest.setAmount(decryptedAmount);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                })
                .collect(Collectors.toList());
    }

    // Method to get all issuance requests fullfilled by a specific issuer
    @Override
    public List<IssuanceRequestDto> GetAllIssuanceRequestsByIssuer(String supplier) {
        List<List<String>> RequestsByIssuer = jdbcService.extractHandledRequestsByIssuer(supplier);
        Key key = keystore.getCurrentKey();
        List<IssuanceRequest> ListIssuanceRequests = RequestsByIssuer.stream()
                .map(this::mapRowToIssuanceRequest)
                .collect(Collectors.toList());

        return ListIssuanceRequests.stream()
                .filter(issuanceRequest -> "Fulfilled".equals(issuanceRequest.getStatus()))
                .map((issuanceRequest) -> Mapper.maptoIssuanceRequestDto(issuanceRequest))
                .peek(issuanceRequest -> {
                    try {
                        String decryptedInitiator = AESEncryption.decrypt(issuanceRequest.getInitiator(), key);
                        String decryptedAmount = AESEncryption.decrypt(issuanceRequest.getAmount(), key);
                        issuanceRequest.setInitiator(decryptedInitiator);
                        issuanceRequest.setAmount(decryptedAmount);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                })
                .collect(Collectors.toList());
    }

    // Map extracted rows to a IssuanceRequest Object
    private IssuanceRequest mapRowToIssuanceRequest(List<String> row) {
        Long id = Long.valueOf(row.get(0));
        String initiator = row.get(1);
        String date = row.get(2);
        String token_id = row.get(3);
        String amount = row.get(4);
        String issuer = row.get(6);
        String status = row.get(5);

        return new IssuanceRequest(id, initiator, date, token_id, amount, issuer, status);
    }

    // Method to get the status of an issuance request by ID
    @Override
    public IssuanceRequestDto GetIssuanceRequestStatus(Long id) {
        IssuanceRequest issuanceRequest = issuanceRequestRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Request with given id not found: " + id));
        if ("Fulfilled".equals(issuanceRequest.getStatus())) {
            throw new IllegalStateException("Request with given id " + id + " has already been fulfilled.");
        }
        return Mapper.maptoIssuanceRequestDto(issuanceRequest);
    }

    // Method to update the status of an issuance request to "Fulfilled" by ID
    @Override
    public IssuanceRequestDto IssuanceRequestStatusUpdate(Long id, String issuer) {
        IssuanceRequest issuanceRequest = issuanceRequestRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Request with given id not found: " + id));
        issuanceRequest.setStatus("Fulfilled");
        issuanceRequest.setIssuer(issuer);
        IssuanceRequest updatedIssuanceRequest = issuanceRequestRepository.save(issuanceRequest);
        return Mapper.maptoIssuanceRequestDto(updatedIssuanceRequest);
    }

}