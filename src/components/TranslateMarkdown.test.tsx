import { screen, simpleRender } from 'test-utils';

import TranslateMarkdown from './TranslateMarkdown';

const renderComponent = ({ source }: { source: string }) => {
  return simpleRender(<TranslateMarkdown source={source} />);
};

describe('TranslateMarkdown', () => {
  test('it can render text', () => {
    const props = { source: 'simple paragraph' };
    const { container } = renderComponent(props);

    expect(container.querySelector('p')).not.toBeInTheDocument();
    expect(screen.getByText(props.source)).toBeInTheDocument();
  });

  test('it can render link', () => {
    const props = { source: '[simple link](https://example.com)' };
    const { container } = renderComponent(props);

    expect(container.querySelector('a[rel="noreferrer"]')).toBeInTheDocument();
    expect(screen.getByText(/simple link/)).toBeInTheDocument();
  });

  test('it fails to render html', () => {
    const props = { source: '<h1>Injection</h1>' };
    renderComponent(props);

    expect(screen.queryByText(/injection/)).not.toBeInTheDocument();
  });
});
