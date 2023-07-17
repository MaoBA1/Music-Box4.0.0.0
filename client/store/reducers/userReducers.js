import { GET_USER_DATA, GET_ALL_USER_PLAYLIST, GET_ALL_USER_SUBSCRIBES, GET_ALL_USER_FAVORITE_SONGS, GET_ALL_SEARCH_RESULTS } from '../actions/userActions';

const initialState = {
    UserReducer: null,
    UserPlaylists: null,
    UserSubs: null,
    UserFavoritesSongs: null,
    AllSearchResults: null,
};


export default (state = initialState, action) => {       
    switch (action.type){
        case GET_USER_DATA:
            return {
                ...state,       
                UserReducer: action.data
            }
        case GET_ALL_USER_PLAYLIST:
            return {
                ...state, 
                UserPlaylists: action.data
            }
        case GET_ALL_USER_SUBSCRIBES:
            return {
                ...state, 
                UserSubs: action.data
            }
        case GET_ALL_USER_FAVORITE_SONGS:
            return {
                ...state,
                UserFavoritesSongs: action.data
            }
        case GET_ALL_SEARCH_RESULTS:
            return {
                ...state,
                AllSearchResults: action.data.allData
            }
        default:
            return state;
    }
}