import React from "react";
import { Routes, Route } from "react-router-dom";
import { NotFound } from "../pages";
import Commentary from "../components/ScorePannel/Board";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index path="/" element={<Commentary />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
