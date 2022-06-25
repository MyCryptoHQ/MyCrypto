export const hasCamera = async (): Promise<boolean> => {
  if (!navigator.mediaDevices) {
    return false;
  }

  const devices = await navigator.mediaDevices.enumerateDevices();
  return !!devices.find((device) => device.kind === 'videoinput');
};
