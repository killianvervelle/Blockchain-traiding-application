package com.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.dto.CustomerDto;
import com.exception.ResourceNotFoundException;
import com.mapper.customerMapper;
import com.model.Customer;
import com.repo.CustomerRepository;
import lombok.AllArgsConstructor;


@Service
@AllArgsConstructor
public class CustomerServImpl implements CustomerService {
    
    private CustomerRepository customerRepository;

    private JDBCService jdbcService;

    @Override
    public CustomerDto createcustomer(CustomerDto customerDto) {
        Customer customer = customerMapper.maptoCustomer(customerDto);
        List<String> attribute_list = jdbcService.extractColumnContent("email");
        if (attribute_list.contains(customerDto.getEmail())) {
            throw new RuntimeException("Account is already registered with this email.");
        }
        Customer savedCustomer = customerRepository.save(customer);
       return customerMapper.mapToCustomerDto(savedCustomer);
    }

    
    @Override
    public CustomerDto GetCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(()-> 
                    new ResourceNotFoundException("Employee with given id does not exist: " + id));
       return customerMapper.mapToCustomerDto((customer));
    }


    @Override
    public List<CustomerDto> GetAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream()
                        .map((customer)-> customerMapper.mapToCustomerDto(customer))
                        .collect(Collectors.toList());  
    }


    @Override
    public CustomerDto UpdateCustomerById(Long id, CustomerDto updatedCustomer) {
        Customer customer = customerRepository.findById(id).orElseThrow(
               () -> new ResourceNotFoundException("Employee with given id not found: " + id));
        customer.setFirst_name(updatedCustomer.getFirst_name());
        customer.setLast_name(updatedCustomer.getLast_name());
        customer.setEmail(updatedCustomer.getEmail());
        Customer updatedCustomerObj = customerRepository.save(customer);
        return customerMapper.mapToCustomerDto(updatedCustomerObj);
    }


    @Override
    public void DeleteCustomerById(Long id) {
        customerRepository.findById(id).orElseThrow(
               () -> new ResourceNotFoundException("Employee with given id not found: " + id));
        customerRepository.deleteById(id);
    }


    @Override
    public List<List<String>> GetUserData(String email) {
        return jdbcService.getUserData(email);
    }
    
}