import { 
    GET_ALL_ARTISTS,
    GET_ARTIST_DATA,
    GET_ARTIST_PLAYLISTS,
    GET_ARTIST_PLAYLISTS_FOR_DASHBOARD_PROFILE,
    CLEAN_PLAYLIST_REDUCER,
    GET_ARTIST_SUBS,
    GET_ARTISTS_BY_USER_FAVORITE_GANERS
} from '../actions/artistActions';

const initialState = {
    ArtistsReducer: null,
    ArtistDataReducer: null,
    ArtistPlaylistsReducer: null,
    ArtistPlaylistsDashBoardReducer: null,
    ArtistSubs: null,
    ArtistsByUserFavoritGeners: null,
}


export default (state = initialState, action) => {       
    switch (action.type){
        case GET_ALL_ARTISTS:
            return {
                ...state,       
                ArtistsReducer: action.data
            }
        case GET_ARTIST_DATA:
            return {
                ...state,       
                ArtistDataReducer: action.data.Artist
            }
        case GET_ARTIST_PLAYLISTS:
            return {
                ...state,       
                ArtistPlaylistsReducer: action.data.playlists
            }
        case GET_ARTIST_PLAYLISTS_FOR_DASHBOARD_PROFILE:
            return {
                ...state,       
                ArtistPlaylistsDashBoardReducer: action.data.playlists
            }
        case CLEAN_PLAYLIST_REDUCER:
            return {
                ...state, 
                ArtistPlaylistsDashBoardReducer: null
            }
        case GET_ARTIST_SUBS:
            {
                return {
                    ...state, 
                    ArtistSubs: action.data.Subscribes
                }
            }
        case GET_ARTISTS_BY_USER_FAVORITE_GANERS:
            return {
                ...state,
                ArtistsByUserFavoritGeners: action.data.List
            }
        default:
            return state;
    }
}