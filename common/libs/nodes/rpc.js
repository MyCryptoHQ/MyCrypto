// @flow
import BaseNode from './base';

export default class RPCNode extends BaseNode {
    endpoint: string;
    constructor(endpoint: string) {
        super();
        this.endpoint = endpoint;
    }
}
