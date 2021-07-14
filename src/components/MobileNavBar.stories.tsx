import { storiesOf } from '@storybook/react';

import MobileNavBar from './MobileNavBar';

const mobileNavBar = () => (
  <div className="sb-container" style={{ width: '100%', maxWidth: '450px' }}>
    <MobileNavBar>
      <div className="tab active">
        <h6>Accounts</h6>
      </div>
      <div className="tab">
        <h6>Addresses</h6>
      </div>
      <div className="w-100" />
      <div className="tab">
        <h6>Network & Nodes</h6>
      </div>
      <div className="tab">
        <h6>General</h6>
      </div>
    </MobileNavBar>
  </div>
);

storiesOf('Molecules/MobileNavBar', module).add('Settings nav bar', () => mobileNavBar(), {
  design: {
    type: 'figma',
    url:
      'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=1522%3A93762'
  }
});
