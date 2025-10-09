import React, { createContext, useContext, useState } from "react";

const ResortContext = createContext();

export const ResortProvider = ({ children }) => {
  const initialResort = {
    name: "",
    description: "",
    country: "",
    state: "",
    city: "",
    category: "",
    type: [],
    facilities: [],
    images: [],
    mainImage: null,
  };

  const [resort, setResort] = useState(initialResort);

  const resetResort = () => setResort(initialResort);

  return (
    <ResortContext.Provider value={{ resort, setResort, resetResort }}>
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
