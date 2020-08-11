// addEventListener support for IE8
function bindEvent(element, eventName, eventHandler) {
  if (element.addEventListener) {
    element.addEventListener(eventName, eventHandler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + eventName, eventHandler);
  }
}

document.domain = 'mycryptobuilds.com';

// Listen to messages from parent window
bindEvent(window, 'message', function (e) {
  const data = e.data;
  if (data && data.type === 'migration') {
    console.log('[msg capture]: newStorage', data);
    var existingStorage = window.localStorage.getItem('MYC_Storage');
    var storageObject = existingStorage ? JSON.parse(existingStorage) : {};
    console.log('[msg capture]: existingStorage', existingStorage);
    // If no storage found or just default storage, replace.
    if (
      !storageObject.accounts ||
      (storageObject.accounts && Object.values(storageObject.accounts).length === 0)
    ) {
      console.log('[msg capture]: setting storage');
      window.importStorage(data.data);
      window.localStorage.setItem('MYC_Storage', data.data);
      e.source.postMessage({ type: 'migration', data: 'success' });
    }
  }
});
