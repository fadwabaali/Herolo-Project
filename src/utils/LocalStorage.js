export const getLocal = (key, defaultVal = []) => {
    return JSON.parse(localStorage.getItem(key)) || defaultVal;
  };
  
  export const setLocal = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  