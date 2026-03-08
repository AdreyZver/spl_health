export const StorageUtils = {

  setLocal: (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value));
  },

  getLocal: (key) => {
    return StorageUtils.isSetLocal(key) ?
      JSON.parse(window.localStorage.getItem(key)) :
      null;
  },

  removeLocal: (key) => {
    window.localStorage.removeItem(key);
  },

  clearLocal: () => {
    window.localStorage.clear();
  },

  isSetLocal: (key) => {
    return !!JSON.parse(window.localStorage.getItem(key));
  }
}