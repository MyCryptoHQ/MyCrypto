import { MenuItemConstructorOptions, shell } from 'electron';
import { APP_TITLE, REPOSITORY } from '../constants';
import packageJson from '../../package.json';
import { knowledgeBaseURL } from 'v2/config';

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

const HELP_MENU: MenuItemConstructorOptions = {
  role: 'help',
  submenu: [
    {
      label: `v${packageJson.version}`,
      enabled: false
    },
    { type: 'separator' },
    {
      label: 'Help / FAQ',
      click() {
        shell.openExternal(knowledgeBaseURL);
      }
    },
    {
      label: 'Report a Bug',
      click() {
        shell.openExternal(`${REPOSITORY}/issues/new`);
      }
    }
  ]
};

if (process.platform === 'darwin') {
  MENU.unshift({
    label: APP_TITLE,
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
      ...(HELP_MENU.submenu as MenuItemConstructorOptions[]),
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
