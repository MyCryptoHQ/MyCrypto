import { shallow } from 'enzyme';

const shallowWithStore = (component: any, store: any) => {
  const context = {
    store
  };
  return shallow(component, { context });
};

export default shallowWithStore;
