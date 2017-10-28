class LocalStorageMock {
  private store: object;

  constructor() {
    this.store = {};
  }

  public clear() {
    this.store = {};
  }

  public getItem(key) {
    return this.store[key];
  }

  public setItem(key, value) {
    this.store[key] = value.toString();
  }

  public removeItem(key) {
    delete this.store[key];
  }
}

Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock()
});
