export const UPLOAD_NEW_SONG = 'UPLOAD_NEW_SONG';
export const GET_ALL_ARTIST_SONGS = "GET_ALL_ARTIST_SONGS";
export const GET_ARTIST_TOP5_SONGS = "GET_ARTIST_TOP5_SONGS";
export const GET_ARTIST_LATEST_REALEASES = "GET_ARTIST_LATEST_REALEASES";
export const CREATE_NEW_PLAYLIST = "CREATE_NEW_PLAYLIST";
export const GET_ALL_ARTIST_SONGS_FOR_DASHBOARD_PROFILE = "GET_ALL_ARTIST_SONGS_FOR_DASHBOARD_PROFILE";
export const GET_ARTIST_TOP5_SONGS_FOR_DASHBOARD_PROFILE = "GET_ARTIST_TOP5_SONGS_FOR_DASHBOARD_PROFILE";
export const GET_ARTIST_LATEST_REALEASES_FOR_DASHBOARD_PROFILE = "GET_ARTIST_LATEST_REALEASES_FOR_DASHBOARD_PROFILE";
export const CLEAN_SONGS_REDUCERS = "CLEAN_SONGS_REDUCERS";
export const GET_SONGS_BY_USER_FAVORITE_GANERS = "GET_SONGS_BY_USER_FAVORITE_GANERS";
export const GET_ALL_SONGS = "GET_ALL_SONGS";

import baseIpRequest from '../../src/ServerDev';



export const uploadNewSongDispatch = data => {
    return dispatch => {
        dispatch({type: UPLOAD_NEW_SONG, data});
    }

} 


export const uploadNewSongAction = (token, details) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/song/creatNewSong', {
            method:'POST',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(details)            
        })
        const data = await response.json(); 
        if(data){
            console.log(data);
            dispatch(uploadNewSongDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const getAllArtistSongsDispatch = data => {
    return dispatch => {
        dispatch({type: GET_ALL_ARTIST_SONGS, data});
    }

} 


export const getAllArtistSongsAction = (token, artistId) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/song/getAllArtistSong/' + artistId, {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json(); 
        if(data){
            dispatch(getAllArtistSongsDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}

export const getArtistTop5SongsDispatch = data => {
    return dispatch => {
        dispatch({type: GET_ARTIST_TOP5_SONGS, data});
    }

} 


export const getArtistTop5SongsAction = (token, artistId) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/song/getArtistTop5Songs/' + artistId, {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json(); 
        if(data){
            dispatch(getArtistTop5SongsDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const getArtistLatestRealeasesDispatch = data => {
    return dispatch => {
        dispatch({type: GET_ARTIST_LATEST_REALEASES, data});
    }

} 


export const getArtistLatestRealeasesAction = (token, artistId) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/song/getArtistLatestReleases/' + artistId, {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json(); 
        if(data){
            dispatch(getArtistLatestRealeasesDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}



export const createNewPlaylistDispatch = data => {
    return dispatch => {
        dispatch({type: CREATE_NEW_PLAYLIST, data});
    }

} 


export const createNewPlaylistAction = (token, details) =>{  
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/song/createNewPlaylist', {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({playlist: details})
        })
        const data = await response.json(); 
        if(data){
            dispatch(createNewPlaylistDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}



export const getAllArtistSongsForDashBoardProfileDispatch = data => {
    return dispatch => {
        dispatch({type: GET_ALL_ARTIST_SONGS_FOR_DASHBOARD_PROFILE, data});
    }

} 


export const getAllArtistSongsForDashBoardProfileAction = (token, artistId) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/song/getAllArtistSong/' + artistId, {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json(); 
        if(data){
            dispatch(getAllArtistSongsForDashBoardProfileDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}

export const getArtistTop5SongsForDashBoardProfileDispatch = data => {
    return dispatch => {
        dispatch({type: GET_ARTIST_TOP5_SONGS_FOR_DASHBOARD_PROFILE, data});
    }

} 


export const getArtistTop5SongsForDashBoardProfileAction = (token, artistId) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/song/getArtistTop5Songs/' + artistId, {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json(); 
        if(data){
            dispatch(getArtistTop5SongsForDashBoardProfileDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const getArtistLatestRealeasesForDashBoardProfileDispatch = data => {
    return dispatch => {
        dispatch({type: GET_ARTIST_LATEST_REALEASES_FOR_DASHBOARD_PROFILE, data});
    }

} 


export const getArtistLatestRealeasesForDashBoardProfileAction = (token, artistId) =>{   
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/song/getArtistLatestReleases/' + artistId, {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json(); 
        if(data){
            dispatch(getArtistLatestRealeasesForDashBoardProfileDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}



export const cleanSongReducerDispatch = () => {
    return dispatch => {
        dispatch({type:CLEAN_SONGS_REDUCERS})
    }
}

export const cleanSongReducerAction = () => {
    return dispatch => {
        dispatch(cleanSongReducerDispatch());
    }
}


export const getSongsByUserFavoriteGenersDispatch = data => {
    return dispatch => {
        dispatch({type:GET_SONGS_BY_USER_FAVORITE_GANERS, data});
    }
}


export const getSongsByUserFavoriteGenersAction = token => {
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/song/getSongsByUserFavoritesGeners', {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json(); 
        if(data){
            dispatch(getSongsByUserFavoriteGenersDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}

export const getAllSongsDispatch = (data) => {
    return dispatch => {
        dispatch({type: GET_ALL_SONGS, data});
    }
}

export const getAllSongsAction = (token) => {
    return async dispatch => {
        const response = await fetch(baseIpRequest.ServerAddress + '/song/getAllSongs', {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json(); 
        if(data){
            dispatch(getAllSongsDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}