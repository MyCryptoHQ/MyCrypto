import ElectronTemplate from './ElectronTemplate';
import WebTemplate from './WebTemplate';

const template = process.env.BUILD_ELECTRON ? ElectronTemplate : WebTemplate;

export default template;
