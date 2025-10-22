import React, { createContext, useContext, useState } from "react";

const ResortContext = createContext();
export const ResortProvider = ({ children }) => {
  const initialResort = {
    name: "",
    description: "",
    country: "",
    countryValue: "",
    state: "",
    stateValue: "",
    city: "",
    cityValue: "",
    category: "",
    latitude: null,
    longitude: null,
    type: [],
    facilities: [],
    images: [],
    mainImage: null,
    pinVerified: false,
    isGestureMap: false,
  };
  const [resort, setResort] = useState(initialResort);
  const resetResort = () => setResort(initialResort);
  return (
    <ResortContext.Provider value={{ resort, setResort, resetResort }}>
      {children}
    </ResortContext.Provider>
  );
};
export const useEditResort = () => {
  const context = useContext(ResortContext);
  if (!context) {
    throw new Error("useResort must use inside of the <ResortProvider>");
  }
  return context;
};
