import { MenuItemConstructorOptions } from 'electron';

const MENU: MenuItemConstructorOptions[] =
  process.platform === 'darwin'
    ? [
        {
          label: 'Edit',
          submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' }
          ]
        }
      ]
    : [];

export default MENU;
