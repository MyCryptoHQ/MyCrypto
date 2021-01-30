// Temporary mock for @blockstack/stats to solve some test issues

export const event = jest.fn();
export const getConfig = jest.fn();
export const page = jest.fn();
export const setConfig = jest.fn();

export const Providers = {
  Segment: jest.fn()
};
