import React from 'react';
import { VERSION } from 'config/data';

const Version: React.SFC<{}> = () => <div className="Version">v{VERSION}</div>;

export default Version;
