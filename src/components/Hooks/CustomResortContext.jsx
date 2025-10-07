import React, { createContext, useContext, useState } from "react";

const ResortContext = createContext();

export const ResortProvider = ({ children }) => {
  const [resort, setResort] = useState({
    name: "",
    description: "",
    country: "",
    county: "",
    city: "",
    category: "",
    type: [],
    facilities: [],
    images: [],
  });

  return (
    <ResortContext.Provider value={{ resort, setResort }}>
      {children}
    </ResortContext.Provider>
  );
};

export const useResort = () => {
  const context = useContext(ResortContext);
  if (!context) {
    throw new Error("useResort must use inside of the <ResortProvider>");
  }
  return context;
};
