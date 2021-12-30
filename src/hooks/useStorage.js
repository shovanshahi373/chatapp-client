import { useState, useEffect } from "react";

const useStorage = (key, value = null) => {
  const [item, setItem] = useState();

  const updateItem = (data) => {
    setItem(data);
  };

  const destroyItem = () => {
    localStorage.removeItem(key);
  };

  useEffect(() => {
    let item = localStorage.getItem(key);
    item = item !== null ? JSON.parse(item) : value;
    updateItem(item);
  }, []);

  useEffect(() => {
    const save = (item) => {
      localStorage.setItem(key, JSON.stringify(item));
    };
    if (item !== undefined) {
      save(item);
    }
  }, [item]);

  return [item, updateItem, destroyItem];
};

export default useStorage;
