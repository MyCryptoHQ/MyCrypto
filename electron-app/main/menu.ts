import { MenuItemConstructorOptions, shell } from 'electron';

const MENU: MenuItemConstructorOptions[] = [
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { role: 'togglefullscreen' },
      { type: 'separator' },
      { role: 'toggledevtools' }
    ]
  }
];

const HELP_MENU = {
  role: 'help',
  submenu: [
    {
      label: 'Help / FAQ',
      click() {
        shell.openExternal('https://myetherwallet.github.io/knowledge-base/');
      }
    },
    {
      label: 'Report a Bug',
      click() {
        shell.openExternal('https://github.com/MyEtherWallet/MyEtherWallet/issues/new');
      }
    }
  ]
};

if (process.platform === 'darwin') {
  MENU.unshift({
    label: 'MyEtherWallet',
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  });

  // Modified help menu
  MENU.push({
    ...HELP_MENU,
    submenu: [
      ...HELP_MENU.submenu,
      {
        label: 'Speech',
        submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }]
      }
    ]
  });
} else {
  MENU.push(HELP_MENU);
}

export default MENU;
