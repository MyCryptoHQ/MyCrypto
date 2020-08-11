// addEventListener support for IE8
function bindEvent(element, eventName, eventHandler) {
  if (element.addEventListener) {
    element.addEventListener(eventName, eventHandler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + eventName, eventHandler);
  }
}

// Listen to messages from parent window
bindEvent(window, 'message', function (e) {
  const data = e.data;
  if (data && data.type === 'migration') {
    console.log('[msg capture]: newStorage', data);
    var existingStorage = window.localStorage.getItem('MYC_Storage');
    var storageObject = existingStorage ? JSON.parse(existingStorage) : {};
    console.log('[msg capture]: existingStorage', existingStorage);
    if (!storageObject.accounts || (storageObject.accounts && storageObject.accounts.length > 0)) {
      console.log('[msg capture]: setting storage');
      window.localStorage.setItem('MYC_Storage', data.data);
    }
  }
});
