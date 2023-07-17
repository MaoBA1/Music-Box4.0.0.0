export const GET_USER_DATA = 'GET_USER_DATA';
export const LOGIN = "LOGIN";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const CREATE_NEW_PLAYLIST = "CREATE_NEW_PLAYLIST";
export const GET_ALL_USER_PLAYLIST = "GET_ALL_USER_PLAYLIST";
export const ADD_SONG_TO_USER_PLAYLIST = "ADD_SONG_TO_USER_PLAYLIST";
export const SUBSCRIBE_TO_ARTIST_PAGE = "SUBSCRIBE_TO_ARTIST_PAGE";
export const UNSUBSCRIBE_TO_ARTIST_PAGE = "UNSUBSCRIBE_TO_ARTIST_PAGE";
export const GET_ALL_USER_SUBSCRIBES = "GET_ALL_USER_SUBSCRIBES";
export const GET_ALL_USER_FAVORITE_SONGS = "GET_ALL_USER_FAVORITE_SONGS";
export const LIKE_TO_SONG = "LIKE_TO_SONG";
export const UNLIKE_TO_SONG = "UNLIKE_TO_SONG";
export const GET_ALL_SEARCH_RESULTS = "GET_ALL_SEARCH_RESULTS";
export const DELETE_USER_PLAYLIST = "DELETE_USER_PLAYLIST";
export const DELETE_SONG_FROM_USER_PLAYLIST = "DELETE_SONG_FROM_USER_PLAYLIST";


import baseIpRequest from '../../src/ServerDev';


export const getUserDataDispatch = data => {
    return dispatch => {
        dispatch({type: GET_USER_DATA, data});
    }

} 


export const getUserDataAction = token =>{     
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/getUserData', {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
                
            }            
        })
        const data = await response.json(); 
        if(data){
            dispatch(getUserDataDispatch(data));
            return true;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const loginDispatch = data => {
    return dispatch => {
        dispatch({type: LOGIN, data});
    }

} 


export const loginAction = details =>{     
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/login', {
            method:'POST',
            headers:{
                'Content-type': 'application/json',
                
            },
            body: JSON.stringify(details)
        })
        const data = await response.json(); 
        if(data.status){
            dispatch(loginDispatch(data));
            return {
                token: data.token,
                isItFirstUse: data.isItFirstUse
            }
        } else {
            throw new Error(data.message);
        }
    }
}


export const updateDispatch = data => {
    return dispatch => {
        dispatch({type: UPDATE_PROFILE, data});
    }

} 


export const updateProfileAction = (token, details) =>{     
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/updateRegularAccount', {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token                    
            },
            body: JSON.stringify(details)
        })
        const data = await response.json(); 
        if(data){
            dispatch(updateDispatch(data));
            if(data.status) {
                return data;
            }
        } else {
            throw new Error(data.message);
        }
    }
}

export const createNewPlaylistDispatch = (data) => {
    return dispatch => {
        dispatch({type: CREATE_NEW_PLAYLIST, data})
    }
}

export const createNewPlaylistAction = (token, playlist) => {
    return async dispatch => {
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/createNewPlaylist', {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token                    
            },
            body: JSON.stringify({playlist: playlist})
        })
        const data = await response.json(); 
        
        if(data){
            dispatch(createNewPlaylistDispatch(data));
            if(data.status) {
                return data;
            }
        } else {
            throw new Error(data.message);
        }
    }
}

export const getAllUserPlaylistsDispatch = (data) => {
    return dispatch => {
        dispatch({type:GET_ALL_USER_PLAYLIST, data})
    }
}

export const getAllUserPlaylistsAction = (token) => {
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/getAllUserPlaylists', {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
                
            }            
        })
        const data = await response.json();
        if(data){
            dispatch(getAllUserPlaylistsDispatch(data));
            return true;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const addSongTouserPlaylistDispatch = (data) => {
    return dispatch => {
        dispatch({type: ADD_SONG_TO_USER_PLAYLIST, data})
    }
}

export const addSongTouserPlaylistAction = (token, song, playlistId) => {
    return async dispatch => {
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/addSongToUserPlaylist/' + playlistId, {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token                    
            },
            body: JSON.stringify({song: song})
        })
        const data = await response.json(); 
        
        if(data){
            dispatch(createNewPlaylistDispatch(data));
            if(data.status) {
                return data;
            }
        } else {
            throw new Error(data.message);
        }
    }
}


export const subscribeToArtistPageDispatch = (data) => {
    return dispatch => {
        dispatch({type: SUBSCRIBE_TO_ARTIST_PAGE, data})
    }
}

export const subscribeToArtistPageAction = (token, artistId) => {
    return async dispatch => {
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/subscribeToArtistPage/' + artistId, {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token                    
            }
        })
        const data = await response.json(); 
        if(data){
            dispatch(subscribeToArtistPageDispatch(data));
            if(data.status) {
                return data;
            }
        } else {
            throw new Error(data.message);
        }
    }
}


export const getAllUserSubScribesDispatch = data => {
    return dispatch => {
        dispatch({type: GET_ALL_USER_SUBSCRIBES, data});
    }

} 


export const getAllUserSubScribesAction = token =>{     
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/getAllUserSubScribes', {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
                
            }            
        })
        const data = await response.json(); 
        if(data){
            dispatch(getAllUserSubScribesDispatch(data));
            return true;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const unsubscribeToArtistPageDispatch = (data) => {
    return dispatch => {
        dispatch({type: SUBSCRIBE_TO_ARTIST_PAGE, data})
    }
}

export const unsubscribeToArtistPageAction = (token, artistId) => {
    return async dispatch => {
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/unsubscribeFromArtistPage/' + artistId, {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token                    
            }
        })
        const data = await response.json();
        if(data){
            dispatch(unsubscribeToArtistPageDispatch(data));
            if(data.status) {
                return data;
            }
        } else {
            throw new Error(data.message);
        }
    }
}

export const getAllUserFavoriteSongsDispatch = data => {
    return dispatch => {
        dispatch({type: GET_ALL_USER_FAVORITE_SONGS, data});
    }

} 


export const getAllUserFavoriteSongsAction = token =>{     
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/getUserFavoriteSong', {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
                
            }            
        })
        const data = await response.json(); 
        if(data){
            dispatch(getAllUserFavoriteSongsDispatch(data));
            return true;
        } else {
            throw new Error('Something went wrong');
        }
    }
}

export const likeUserSongDispatch = data => {
    return dispatch => {
        dispatch({type: LIKE_TO_SONG, data});
    }

} 


export const likeUserSongAction = (token, songId) =>{     
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/likeToSong/' + songId, {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token                    
            }
        })
        const data = await response.json(); 
        if(data){
            dispatch(likeUserSongDispatch(data));
            if(data.status) {
                return data;
            }
        } else {
            throw new Error(data.message);
        }
    }
}

export const unlikeUserSongDispatch = data => {
    return dispatch => {
        dispatch({type: UNLIKE_TO_SONG, data});
    }

} 


export const unlikeUserSongAction = (token, songId) =>{     
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/unlikeToSong/' + songId, {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token                    
            }
        })
        const data = await response.json(); 
        if(data){
            dispatch(unlikeUserSongDispatch(data));
            if(data.status) {
                return data;
            }
        } else {
            throw new Error(data.message);
        }
    }
}


export const getAllSearchResultsDispatch = (data) => {
    return dispatch => {
        dispatch({type:GET_ALL_SEARCH_RESULTS, data});
    }
}


export const getAllSearchResultsAction = (token) => {
    return async dispatch => {
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/getSearchResult', {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token                    
            }
        })

        const data = await response.json();
        if(data) {
            dispatch(getAllSearchResultsDispatch(data));
            return data;
        } else {
            throw new Error(data.message);
        }
    }
}


export const deleteUserPlaylistDispatch = (data) => {
    return dispatch => {
        dispatch({type:DELETE_USER_PLAYLIST, data});
    }
}

export const deleteUserPlaylistAction = (token, playlistId) => {
    return async dispatch => {
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/deletUserPlaylist/' + playlistId, {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token                    
            }
        })
    
        const data = await response.json();
        if(data) {
            dispatch(deleteUserPlaylistDispatch(data));
        } else {
            throw new Error(data.message);
        }
    }
}

export const deleteSongFromUserPlaylistDispatch = (data) => {
    return dispatch => {
        dispatch({type:DELETE_SONG_FROM_USER_PLAYLIST, data});
    }
}

export const deleteSongFromUserPlaylistAction = (token, playlistId, songName) => {
    return async dispatch => {
        const response = await fetch(baseIpRequest.ServerAddress + '/accounts/deleteSongFromUserPlaylist/' + playlistId + '/' + songName, {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        const data = await response.json();
        if(data) {
            dispatch(deleteSongFromUserPlaylistDispatch(data));
            return true;
        } else {
            throw new Error('Something went wrong');
        }
    }
}


