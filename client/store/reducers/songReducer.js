import {
     UPLOAD_NEW_SONG,
     GET_ALL_ARTIST_SONGS,
     GET_ARTIST_TOP5_SONGS,
     GET_ARTIST_LATEST_REALEASES,
     GET_ARTIST_LATEST_REALEASES_FOR_DASHBOARD_PROFILE,
     GET_ARTIST_TOP5_SONGS_FOR_DASHBOARD_PROFILE,
     GET_ALL_ARTIST_SONGS_FOR_DASHBOARD_PROFILE,
     CLEAN_SONGS_REDUCERS,
     GET_SONGS_BY_USER_FAVORITE_GANERS,
     GET_ALL_SONGS
 } from '../actions/songActions';

const initialState = {
    ArtistSongsReducer: null,
    ArtistTop5SongsReducer: null,
    ArtistLatestReleasesReducer: null,
    ArtistSongsDashBoardProfileReducer: null,
    ArtistTop5SongsDashBoardProfileReducer: null,
    ArtistLatestReleasesDashBoardProfileReducer: null,
    SongsByUserFavoriteGeners: null,
    AllSongs: null
};



export default (state = initialState, action) => {       
    switch (action.type){
        case GET_ALL_ARTIST_SONGS:
            return {
                ...state,       
                ArtistSongsReducer: action.data.ArtistSongs
            } 
        case GET_ARTIST_TOP5_SONGS:
            return {
                ...state,       
                ArtistTop5SongsReducer: action.data.Songs
            } 
        case GET_ARTIST_LATEST_REALEASES:
            return {
                ...state,       
                ArtistLatestReleasesReducer: action.data.Songs
            } 
        case GET_ALL_ARTIST_SONGS_FOR_DASHBOARD_PROFILE:
            return {
                ...state,       
                ArtistSongsDashBoardProfileReducer: action.data.ArtistSongs
            } 
        case GET_ARTIST_TOP5_SONGS_FOR_DASHBOARD_PROFILE:
            return {
                ...state,       
                ArtistTop5SongsDashBoardProfileReducer: action.data.Songs
            } 
        case GET_ARTIST_LATEST_REALEASES_FOR_DASHBOARD_PROFILE:
            return {
                ...state,       
                ArtistLatestReleasesDashBoardProfileReducer: action.data.Songs
            }   
        case CLEAN_SONGS_REDUCERS:
            return {
                ...state, 
                ArtistSongsDashBoardProfileReducer: null,
                ArtistTop5SongsDashBoardProfileReducer: null,
                ArtistLatestReleasesDashBoardProfileReducer: null,
            } 
        case GET_SONGS_BY_USER_FAVORITE_GANERS:
            return {
                ...state,
                SongsByUserFavoriteGeners: action.data
            }  
        case GET_ALL_SONGS:
            return {
                ...state,
                AllSongs: action.data.Songs
            }  
        default:
            return state;
    }
}