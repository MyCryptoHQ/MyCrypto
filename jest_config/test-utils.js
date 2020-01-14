// Setup react-testing-library
// https://testing-library.com/docs/react-testing-library/setup#custom-render

import { render } from '@testing-library/react'

const AllTheProviders = ({ children }) => {
  return (
    <>
      
    </>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
// export { customRender as render }
// export { render