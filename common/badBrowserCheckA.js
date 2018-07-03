
// use dates as vars so they're not stripped out by minification
let letCheck = new Date();
const constCheck = new Date();
const arrowCheck = (() => new Date())();

if (letCheck && constCheck && arrowCheck) {
  window.localStorage.setItem('goodBrowser', 'true');
}
