//import ElectronTemplate from './ElectronTemplate';
import WebTemplate from './WebTemplate';

const TabSection = /*process.env.BUILD_ELECTRON ? ElectronTemplate :*/ WebTemplate;

export default TabSection;
