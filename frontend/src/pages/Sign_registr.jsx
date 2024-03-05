import React, { useEffect,useState } from 'react';
import { useLocation } from 'react-router-dom';

const Sign_registr = () => {
    const { pathname } = useLocation();
  
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);
  
    return (
      <div id="wrapper">
        <div className="container-fluid">
        <br />
        <h1 className="h3 mb-0 text-gray-800">Signature Registration</h1>
        <div classname="container-fluid">
        </div>
        </div>
      </div>
    );
  };

export default Sign_registr;