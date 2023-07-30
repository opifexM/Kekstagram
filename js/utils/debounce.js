function debounce(func, delay) {
  let inDebounce;
  const debounced = (...args) => {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(this, args), delay);
  };
  debounced.cancel = () => clearTimeout(inDebounce);
  return debounced;
}

export {debounce};
