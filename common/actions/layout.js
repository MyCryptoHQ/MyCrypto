export const UI_OPEN_SIDEBAR = 'UI_OPEN_SIDEBAR';
export const UI_CLOSE_SIDEBAR = 'UI_CLOSE_SIDEBAR';
export const UI_ACTIVATE_OBFUSCATOR = 'UI_ACTIVATE_OBFUSCATOR';
export const UI_DEACTIVATE_OBFUSCATOR = 'UI_DEACTIVATE_OBFUSCATOR';
export const UI_WINDOW_RESIZE = 'UI_WINDOW_RESIZE';

export const CLOSE_SIDEBAR = () => ({
    type: UI_CLOSE_SIDEBAR
})

export const OPEN_SIDEBAR = () => ({
    type: UI_OPEN_SIDEBAR
})

export const ACTIVATE_OBFUSCATOR = () => ({
    type: UI_ACTIVATE_OBFUSCATOR
})

export const DEACTIVATE_OBFUSCATOR = () => ({
    type: UI_DEACTIVATE_OBFUSCATOR
})

export const WINDOW_RESIZE = () => ({
    type: UI_WINDOW_RESIZE
})
