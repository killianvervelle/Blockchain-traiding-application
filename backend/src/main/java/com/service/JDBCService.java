package com.service;

import java.util.List;


public interface JDBCService {
    
    List<String> extractColumnContent(String column);
    List<List<String>> getUserData(String email);
    void printUserDataAsFrame(List<List<String>> tableData);
}