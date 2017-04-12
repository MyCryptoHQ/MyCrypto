import {get} from './utils';

export async function getInbox_API() {
    return await get('https://jsonplaceholder.typicode.com/users')
}
