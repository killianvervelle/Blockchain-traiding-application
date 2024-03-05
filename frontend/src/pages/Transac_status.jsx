import React, { useEffect,useState } from 'react';
import { useLocation } from 'react-router-dom';

const Transac_status = () => {
    const { pathname } = useLocation();
  
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);
  
    return (
      <div id="wrapper">
        <div className="container-fluid">
        <br />
        <h1 className="h3 mb-0 text-gray-800">Transaction status</h1>
        <div classname="container-fluid">
        </div>
        </div>
      </div>
    );
  };

export default Transac_status;