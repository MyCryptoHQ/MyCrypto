const isMobile =
  window && window.navigator ? /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent) : false;

export default isMobile;
