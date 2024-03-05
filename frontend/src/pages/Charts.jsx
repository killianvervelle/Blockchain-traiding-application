import '../../src/App.css';

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Register = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return (
      <div id="wrapper">
            {/* Begin Page Content */}
            <div className="container-fluid">
            <br />
            <h1 className="h3 mb-0 text-gray-800">Charts</h1>
            <br />
              {/* Page Heading */}
              {/* Content Row */}
              <div className="side-by-side">
                <div className="col-xl-4 col-lg-4">
                  {/* Area Chart */}
                  <div className="card shadow mb-4">
                    <div className="card-header py-3">
                      <h6 className="m-0 font-weight-bold text-primary">
                        Area Chart
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="chart-area">
                        <canvas id="myAreaChart" />
                      </div>
                      <hr />
                    </div>
                  </div>
                  {/* Bar Chart */}
                  <div className="card shadow mb-4">
                    <div className="card-header py-3">
                      <h6 className="m-0 font-weight-bold text-primary">
                        Bar Chart
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="chart-bar">
                        <canvas id="myBarChart" />
                      </div>
                      <hr />
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4">
                {/* Donut Chart */}
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">
                            Bar Chart
                        </h6>
                        </div>
                        <div className="card-body">
                        <div className="chart-bar">
                            <canvas id="myBarChart" />
                        </div>
                        <hr />
                        </div>
                    </div>
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">
                            Bar Chart
                        </h6>
                        </div>
                        <div className="card-body">
                        <div className="chart-bar">
                            <canvas id="myBarChart" />
                        </div>
                        <hr />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Register;
