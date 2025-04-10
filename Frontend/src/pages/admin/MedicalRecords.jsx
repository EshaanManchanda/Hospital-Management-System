import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Records from "./Records";

/**
 * Medical Records page - this is a wrapper to maintain compatibility 
 * with the sidebar path "/admin-dashboard/medical-records" while using
 * the existing Records component.
 */
const MedicalRecords = () => {
  return <Records />;
};

export default MedicalRecords; 