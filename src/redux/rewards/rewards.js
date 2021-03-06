import RewardsDAO from '../../dao/RewardsDAO'
import RewardsModel from '../../models/RewardsModel'

export const REWARDS_FETCH_START = 'rewards/FETCH_START'
export const REWARDS_DATA = 'rewards/DATA'

const initialState = {
  data: new RewardsModel(),
  isFetching: false,
  isReady: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REWARDS_DATA:
      return {
        ...state,
        data: action.data,
        isFetching: false,
        isReady: true
      }
    case REWARDS_FETCH_START:
      return {
        ...state,
        isFetching: true
      }
    default:
      return state
  }
}

const getRewardsData = account => dispatch => {
  dispatch({type: REWARDS_FETCH_START})
  return RewardsDAO.getData(account).then(data => {
    dispatch({type: REWARDS_DATA, data})
  })
}

const withdrawRevenue = account => dispatch => {
  dispatch({type: REWARDS_FETCH_START})
  return RewardsDAO.withdrawRewardsFor(account).then(() => {
    return dispatch(getRewardsData(account))
  })
}

const closePeriod = (account) => dispatch => {
  dispatch({type: REWARDS_FETCH_START})
  return RewardsDAO.closePeriod(account).then(() => {
    return dispatch(getRewardsData(account))
  })
}

export {
  getRewardsData,
  withdrawRevenue,
  closePeriod
}

export default reducer
