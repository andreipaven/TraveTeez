import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useResortStorage = (storageKey = "resort") => {
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

  const [resort, setResortState] = useState(initialResort);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResort = async () => {
      try {
        const saved = await AsyncStorage.getItem(storageKey);
        if (saved) {
          setResortState(JSON.parse(saved));
        }
      } catch (e) {
        console.log("Eroare la încărcarea resortului:", e);
      } finally {
        setLoading(false);
      }
    };
    loadResort();
  }, []);

  const setResort = async (updater) => {
    try {
      setResortState((prev) => {
        const newResort =
          typeof updater === "function" ? updater(prev) : updater;

        AsyncStorage.setItem(storageKey, JSON.stringify(newResort));
        return newResort;
      });
    } catch (e) {
      console.log("Eroare la salvarea resortului:", e);
    }
  };

  const resetResort = async () => {
    try {
      await AsyncStorage.removeItem(storageKey);
      setResortState(initialResort);
    } catch (e) {
      console.log("Eroare la resetarea resortului:", e);
    }
  };

  return { resort, setResort, resetResort, loading };
};

export default useResortStorage;
