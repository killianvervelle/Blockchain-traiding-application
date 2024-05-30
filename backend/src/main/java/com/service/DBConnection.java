package com.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

// Class for establishing a connection to the standalone DB.
public class DBConnection {

    private static Connection connection = null;

    public static Connection DatabaseConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/users", "root", "kech1991");
        }
        return connection;
    }
}
