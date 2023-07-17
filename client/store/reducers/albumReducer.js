import {GET_ALL_ARTIST_ALBUMS, GET_ALL_ARTIST_ALBUMS_FOR_DASHBOARD_PROFILE, CLEAN_ALBUM_REDUCER} from '../actions/albumsActions';


const initialState = {
    ArtistAlbumReducer: null,
    ArtistAlbumDashBordReducer: null,
}


export default (state = initialState, action) => {
    switch (action.type){
        case GET_ALL_ARTIST_ALBUMS:
            return {
                ...state,
                ArtistAlbumReducer: action.data
            }
        case GET_ALL_ARTIST_ALBUMS_FOR_DASHBOARD_PROFILE:
            return {
                ...state,
                ArtistAlbumDashBordReducer: action.data
            }
        case CLEAN_ALBUM_REDUCER:
            return {
                ...state,
                ArtistAlbumDashBordReducer: null
            }
        default:
            return state;
    }
}
