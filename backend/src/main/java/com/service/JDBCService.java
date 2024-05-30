package com.service;

import java.util.List;

// Interface for JDBC service
public interface JDBCService {

    List<String> extractColumnContent(String column);

    List<List<String>> getUserData(String email);

    void printUserDataAsFrame(List<List<String>> tableData);

    List<List<String>> extractHandledRequestsByIssuer(String issuer);
}