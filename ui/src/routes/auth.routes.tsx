import React from "react";
import { Routes, Route } from "react-router-dom";

import { NotFound } from "../pages";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* <Route index path="/" element={<SignIn />} /> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
