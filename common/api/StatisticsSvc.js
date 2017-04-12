import {get} from './utils'

export async function getStatistics_API() {
    return await get('https://jsonplaceholder.typicode.com/posts?userId=1&userId=2')
}
