import configuredStore from './store';

export function getInitialState() {
  return { ...configuredStore.getState() };
}

export function testShallowlyEqual(oldValue: any, newValue: any) {
  it('should be shallowly equal when called again with the same state', () => {
    expect(oldValue === newValue).toBeTruthy();
  });
}
