import React from 'react';

/**
 * We use react-inlingsvg in the app and rely on `fileMock` to stub svg file requests in jest
 * Because of the stub, the dependency throughs an `isomorphic-fetch` error requesting an `absolute url`.
 * Mock the component returned by the dependency to silence the error.
 * ref. https://github.com/gilbarbara/react-inlinesvg/issues/140
 */

const svgMock = ({ src, ...props }) => <svg {...props} id={src} />;

export default svgMock;
