'use strict';

import baseConfig from './base';

let config = {
    BASE_API: 'http://localhost:3333/api/v1'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
