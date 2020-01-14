import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import { render } from 'test-utils';

test('Says Hello', async () => {
  const { getByRole } = render(<button>Hello</button>);
  expect(getByRole('button')).toHaveTextContent('Hello');
});
