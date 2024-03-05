import '../../src/App.css';

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Tables = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return (
    <div id="wrapper">
    {/* Begin Page Content */}
    <div className="container-fluid">
    <br />
    <h1 className="h3 mb-0 text-gray-800">Tables</h1>
    <br />
      {/* Page Heading */}
      {/* Content Row */}
      <div className="container">
            <table border="{1}">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Number</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>john@example.com</td>
                  <td>0786254487</td>
                  <td>***********</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jane Smith</td>
                  <td>jane@example.com</td>
                  <td>0786254487</td>
                  <td>**********</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Killian Vervelle</td>
                  <td>killian@example.com</td>
                  <td>0786254487</td>
                  <td>**********</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>john@example.com</td>
                  <td>0786254487</td>
                  <td>***********</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jane Smith</td>
                  <td>jane@example.com</td>
                  <td>0786254487</td>
                  <td>**********</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Killian Vervelle</td>
                  <td>killian@example.com</td>
                  <td>0786254487</td>
                  <td>**********</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>john@example.com</td>
                  <td>0786254487</td>
                  <td>***********</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jane Smith</td>
                  <td>jane@example.com</td>
                  <td>0786254487</td>
                  <td>**********</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Killian Vervelle</td>
                  <td>killian@example.com</td>
                  <td>0786254487</td>
                  <td>**********</td>
                </tr>
                <tr />
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};

export default Tables;