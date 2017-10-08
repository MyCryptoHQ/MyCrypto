// If you want to add checks, try to use the ones from Modernizr.
// https://github.com/Modernizr/Modernizr/tree/master/feature-detects
export default function checkBadBrowser() {
  // Check if they support localstorage. Just being there isn't enough,
  // because old versions of safari and iOS throw exceptions on using it.
  try {
    window.localStorage.setItem('test', 'test');
    window.localStorage.removeItem('test');
  } catch (err) {
    return true;
  }

  // Check if they support flexbox. Wrapped in try / catch because _very_ old
  // browsers don't support el.style.
  try {
    const el = document.createElement('div');
    el.style.display = 'flex';
    if (el.style.display !== 'flex') {
      return false;
    }
  } catch (err) {
    return true;
  }
}
