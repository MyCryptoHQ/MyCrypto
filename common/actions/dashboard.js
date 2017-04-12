//import api service
import {getStatistics_API} from 'api/StatisticsSvc'
//import request management utils
import {resultOK} from 'api/utils'

//define action types
export const GET_STATISTICS_SUCCESS = 'GET_STATISTICS_SUCCESS'
export const GET_STATISTICS_FAIL = 'GET_STATISTICS_FAIL'

export const GET_STATISTICS = async () => {
    let result = await getStatistics_API()
    if (!resultOK(result)) {
        return {type: GET_STATISTICS_FAIL, error: result.data}
    }
    return {type: GET_STATISTICS_SUCCESS, result: result.data}
}
