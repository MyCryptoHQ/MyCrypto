import {
  BrowserWindow,
  clipboard,
  Menu,
  MenuItemConstructorOptions,
  PopupOptions,
  shell
} from 'electron';
import { URL } from 'url';

function popupContextMenu(
  window: BrowserWindow,
  isDevelopment: boolean,
  props: Electron.ContextMenuParams
) {
  const editFlags = props.editFlags;
  const hasText = props.selectionText.trim().length > 0;
  const roleEnabled = (flag: keyof Electron.EditFlags) => editFlags[flag] && hasText;

  // Not using the `enable` nor `visible` properties of MenuConstructorOptions
  // As they do not appear to work w/ Electron 1.8.4 on Mac OS X
  let ctxMenuTmpl: MenuItemConstructorOptions[] = [];

  if (roleEnabled('canCut') && props.isEditable) {
    ctxMenuTmpl.push({
      accelerator: 'CmdOrCtrl+X',
      role: 'cut'
    });
  }

  if (roleEnabled('canCopy') && hasText) {
    ctxMenuTmpl.push({
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    });
  }

  // For some reason, editFlags.canCopy is often false but the keyboard shortcut to paste still works
  // let's only check if the currently focused element is editable
  if (props.isEditable) {
    ctxMenuTmpl.push({
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    });
  }

  if (props.linkURL && props.mediaType === 'none') {
    ctxMenuTmpl = ctxMenuTmpl.concat([
      { type: 'separator' },
      {
        id: 'copyLink',
        label: 'Copy Link',
        click() {
          if (process.platform === 'darwin') {
            clipboard.writeBookmark(props.linkText, props.linkURL);
          } else {
            clipboard.writeText(props.linkURL);
          }
        }
      },
      {
        id: 'openLink',
        label: 'Open Link in Browser',
        click() {
          // Only allow HTTPS urls to actually be opened
          const url = new URL(props.linkURL);
          if (url.protocol === 'https:') {
            shell.openExternal(props.linkURL);
          } else {
            console.warn(
              `Blocked request to open new window '${props.linkURL}', only HTTPS links are allowed`
            );
          }
        }
      }
    ]);
  }

  // add the Inspect Element button
  if (isDevelopment) {
    ctxMenuTmpl = ctxMenuTmpl.concat([
      { type: 'separator' },
      {
        label: 'Inspect Element',
        click: () => {
          window.webContents.inspectElement(props.x, props.y);
          if (window.webContents.isDevToolsOpened()) {
            window.webContents.devToolsWebContents.focus();
          }
        }
      }
    ]);
  }

  const ctxMenu = Menu.buildFromTemplate(ctxMenuTmpl);

  const popupOpts: PopupOptions = {
    window,
    x: props.x,
    y: props.y
  };

  ctxMenu.popup(popupOpts);
}

export default popupContextMenu;
