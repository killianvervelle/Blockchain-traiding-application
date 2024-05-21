package com.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dto.CustomerDto;
import com.service.CustomerService;
import lombok.AllArgsConstructor;


@AllArgsConstructor
@RestController
@RequestMapping("/customer")
public class CustomerControl {
    
    private CustomerService customerService;

    @PostMapping("register")
    public ResponseEntity<CustomerDto> createCustomer(@RequestBody CustomerDto customerDto){
        CustomerDto savedCustomerDto = customerService.createcustomer(customerDto);
        return new ResponseEntity<>(savedCustomerDto, HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<CustomerDto> GetCustomerById(@PathVariable("id") Long id){
        CustomerDto customerDto = customerService.GetCustomerById(id);
        return ResponseEntity.ok(customerDto);
    }

    @GetMapping
    public ResponseEntity<List<CustomerDto>> GetAllCustomers(){
        List<CustomerDto> customersDto = customerService.GetAllCustomers();
        return ResponseEntity.ok(customersDto);
    }

    @PutMapping("{id}")
    public ResponseEntity<CustomerDto> UpdateCustomer(@PathVariable("id") Long id, @RequestBody CustomerDto customerDto){
        CustomerDto updatedCustomerDto = customerService.UpdateCustomerById(id, customerDto);
        return ResponseEntity.ok(updatedCustomerDto);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> DeleteCustomer(@PathVariable("id") Long id){
        customerService.DeleteCustomerById(id);
        return ResponseEntity.ok("Customer with given id was successfully deleted: "+id);
    }

    @GetMapping("/userData/{email}")
    public ResponseEntity<List<List<String>>> GetUserData(@PathVariable("email") String email) {
        List<List<String>> userData = customerService.GetUserData(email);
        return ResponseEntity.ok(userData);
    }
}
