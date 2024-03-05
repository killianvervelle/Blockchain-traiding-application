import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Settings = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div>
      {/* Home page content */}
    </div>
  );
};

export default Settings;