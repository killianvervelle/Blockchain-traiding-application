package com.controller;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.dto.CustomerDto;
import com.dto.IssuanceRequestDto;
import com.service.Services;
import lombok.AllArgsConstructor;

/**
 * Controler class handles HTTP requests for customer and issuance request
 * operations.
 * It uses a service layer to perform the necessary business logic.
 */

@AllArgsConstructor
@RestController
public class Controler {

    private Services Service;

    private static final Logger logger = LogManager.getLogger(IssuanceRequestDto.class);

    /**
     * Creates a new customer.
     */
    @PostMapping("register/user")
    public ResponseEntity<CustomerDto> createCustomer(@RequestBody CustomerDto customerDto) {
        CustomerDto savedCustomerDto = Service.createcustomer(customerDto);
        return new ResponseEntity<>(savedCustomerDto, HttpStatus.CREATED);
    }

    /**
     * Retrieves a customer by their ID.
     * 
     * @param id the customer ID
     * @return the customer data transfer object
     */
    @GetMapping("{id}")
    public ResponseEntity<CustomerDto> GetCustomerById(@PathVariable("id") Long id) {
        CustomerDto customerDto = Service.GetCustomerById(id);
        return ResponseEntity.ok(customerDto);
    }

    /**
     * Retrieves all customers.
     * 
     * @return a list of customer data transfer objects
     */
    @GetMapping
    public ResponseEntity<List<CustomerDto>> GetAllCustomers() {
        List<CustomerDto> customersDto = Service.GetAllCustomers();
        return ResponseEntity.ok(customersDto);
    }

    /**
     * Updates a customer by their ID.
     * 
     * @param id          the customer ID
     * @param customerDto the updated customer data transfer object
     * @return the updated customer
     */
    @PutMapping("{id}")
    public ResponseEntity<CustomerDto> UpdateCustomer(@PathVariable("id") Long id,
            @RequestBody CustomerDto customerDto) {
        CustomerDto updatedCustomerDto = Service.UpdateCustomerById(id, customerDto);
        return ResponseEntity.ok(updatedCustomerDto);
    }

    /**
     * Deletes a customer by their ID.
     * 
     * @param id the customer ID
     * @return a confirmation message
     */
    @DeleteMapping("{id}")
    public ResponseEntity<String> DeleteCustomer(@PathVariable("id") Long id) {
        Service.DeleteCustomerById(id);
        return ResponseEntity.ok("Customer with given id was successfully deleted: " + id);
    }

    /**
     * Retrieves user data by email.
     * 
     * @param email the user's email
     * @return a list of user data
     */
    @GetMapping("/userData/{email}")
    public ResponseEntity<List<List<String>>> GetUserData(@PathVariable("email") String email) {
        List<List<String>> userData = Service.GetUserData(email);
        return ResponseEntity.ok(userData);
    }

    /**
     * Registers a new token issuance request.
     * 
     * @param issuanceRequestDto the issuance request data transfer object
     * @return the registered issuance request
     */
    @PostMapping("/register/issuance-request")
    public ResponseEntity<IssuanceRequestDto> RegisterIssuanceRequest(
            @RequestBody IssuanceRequestDto issuanceRequestDto) {
        logger.info("IssuanceRequestDto: {}", issuanceRequestDto);
        IssuanceRequestDto savedIssuanceRequestDto = Service.RegisterIssuanceRequest(issuanceRequestDto);
        return ResponseEntity.ok(savedIssuanceRequestDto);
    }

    /**
     * Updates the status of an issuance request by its ID.
     * 
     * @param id the issuance request ID
     * @return the updated issuance request
     */
    @PostMapping("/update/{issuer}/{id}")
    public ResponseEntity<IssuanceRequestDto> IssuanceRequestStatusUpdate(@PathVariable("id") Long id,
            @PathVariable("issuer") String issuer) {
        logger.info("Updating the status of the issuance request with the id: " + id + "...");
        IssuanceRequestDto fetchedIssuanceRequestDto = Service.IssuanceRequestStatusUpdate(id, issuer);
        return ResponseEntity.ok(fetchedIssuanceRequestDto);
    }

    /**
     * Retrieves the status of an issuance request by its ID.
     * 
     * @param id the issuance request ID
     * @return the issuance request data transfer object
     */
    @GetMapping("/check-request/{id}")
    public ResponseEntity<IssuanceRequestDto> GetIssuanceRequestStatus(@PathVariable("id") Long id) {
        IssuanceRequestDto checkedIssuanceRequestDto = Service.GetIssuanceRequestStatus(id);
        return ResponseEntity.ok(checkedIssuanceRequestDto);
    }

    /**
     * Retrieves all token issuance requests.
     * 
     * @return a list of issuance request data transfer objects
     */
    @GetMapping("/issuance-requests")
    public ResponseEntity<List<IssuanceRequestDto>> GetAllIssuanceRequests() {
        List<IssuanceRequestDto> ListIssuanceRequestDto = Service.GetAllIssuanceRequests();
        return ResponseEntity.ok(ListIssuanceRequestDto);
    }

    /**
     * Retrieves all token issuance requests fullfilled by an issuer.
     * 
     * @return a list of issuance request data transfer objects
     */
    @GetMapping("/issuance-requests/{issuer}")
    public ResponseEntity<List<IssuanceRequestDto>> GetAllIssuanceRequestsByIssuer(
            @PathVariable("issuer") String issuer) {
        List<IssuanceRequestDto> ListIssuanceRequestDto = Service.GetAllIssuanceRequestsByIssuer(issuer);
        return ResponseEntity.ok(ListIssuanceRequestDto);
    }
}
