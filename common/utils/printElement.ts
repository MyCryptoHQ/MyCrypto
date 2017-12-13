import React from 'react';
import { renderToString } from 'react-dom/server';

interface PrintOptions {
  styles?: string;
  printTimeout?: number;
  popupFeatures?: object;
}

export default function(element: React.ReactElement<any>, opts: PrintOptions = {}) {
  const options = {
    styles: '',
    printTimeout: 500,
    popupFeatures: {},
    ...opts
  };

  // Convert popupFeatures into a key=value,key=value string. See
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/open#Window_features
  // for more information.
  const featuresStr = Object.keys(options.popupFeatures)
    .map(key => `${key}=${options.popupFeatures[key]}`)
    .join(',');

  const popup = window.open('about:blank', 'printWindow', featuresStr);
  if (popup) {
    popup.document.open();
    popup.document.write(`
  <html>
    <head>
      <style>${options.styles}</style>
      <script>
        setTimeout(function() {
          window.print();
        }, ${options.printTimeout});
      </script>
    </head>
    <body>
      ${renderToString(element)}
      <script>
        // FIXME consider if we REALLY want it
        var width = document.body.children[0].offsetWidth;
        var height = document.body.children[0].offsetHeight;
        window.moveTo(0, 0);
        // FIXME Chrome could be larger (i guess?)
        window.resizeTo(width + 60, height + 60);
      </script>
    </body>
    </html>
	`);
  }
}
