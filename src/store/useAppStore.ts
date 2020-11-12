import { useDispatch, useSelector } from './index';
import { resetState } from './root.reducer';
import { getNetworks, getPassword, getState, getVault } from './selectors';
import { destroyVault, setVault } from './vault.slice';

function useAppStore() {
  const dispatch = useDispatch();
  const password = useSelector(getPassword);
  const vault = useSelector(getVault);
  const state = useSelector(getState);
  const networks = useSelector(getNetworks);

  return {
    networks,
    // Vault ie. EncryptedDB
    password,
    vault,
    setVault: (data: string) => dispatch(setVault({ mtime: Date.now().toString(), data })),
    destroyVault: () => dispatch(destroyVault()),
    // Store wide actions
    resetAppDb: () => dispatch(resetState()),
    removeSeedData() {
      this.resetAppDb(state);
    },
    addSeedData() {
      this.resetAppDb(state);
    }
  };
}

export default useAppStore;
