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
  console.log('[msg capture]: newStorage', data);
  var existingStorage = window.localStorage.getItem('MYC_Storage');
  console.log('[msg capture]: existingStorage', existingStorage);
  if (!existingStorage) {
    console.log('[msg capture]: setting storage');
    window.localStorage.setItem('MYC_Storage', data);
  }
});
