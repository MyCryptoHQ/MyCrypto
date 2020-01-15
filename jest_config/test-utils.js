// Setup react-testing-library
// https://testing-library.com/docs/react-testing-library/setup#custom-render
import { render } from '@testing-library/react'

// Mock for features used by react-slider
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () { },
      removeListener: function () { }
    };
  };

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  function (callback) {
    setTimeout(callback, 0);
  };

// Create custom renderer to share setup between component tests.
const AllTheProviders = ({ children }) => {
  return (<></>)
}

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options })


// re-export everything
export * from '@testing-library/react'

// override render method
// export { customRender as render }
