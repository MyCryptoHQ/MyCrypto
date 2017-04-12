import {resultOK} from 'api/utils'
import {getInbox_API} from 'api/InboxSvc'

export const GET_INBOX_SUCCESS = 'GET_INBOX_SUCCESS'
export const GET_INBOX_FAIL = 'GET_INBOX_FAIL'

export const GET_INBOX = async () => {
    let result = await getInbox_API()
    if (!resultOK(result)) {
        return {type: GET_INBOX_FAIL, error: result.data}
    }
    return {type: GET_INBOX_SUCCESS, result: result.data}
}
