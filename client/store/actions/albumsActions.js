export const GET_ALL_ARTIST_ALBUMS = "GET_ALL_ARTIST_ALBUMS";
export const GET_ALL_ARTIST_ALBUMS_FOR_DASHBOARD_PROFILE = "GET_ALL_ARTIST_ALBUMS_FOR_DASHBOARD_PROFILE"; 
export const CLEAN_ALBUM_REDUCER = "CLEAN_ALBUM_REDUCER";
export const CREATE_NEW_ALBUM = "CREATE_NEW_ALBUM";

import baseIpRequest from '../../src/ServerDev';


export const getAllArtistAlbumsDispatch = (data) => {
    return dispatch => {
        dispatch({type: GET_ALL_ARTIST_ALBUMS, data});
    }
}


export const getAllArtistAlbumsAction = (token, artistId) => {
    return async dispatch => {       
        const response = await fetch(baseIpRequest.ServerAddress + '/album/getAllArtistAlbums/' + artistId, {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            
        })
        const data = await response.json();
        if(data) {
            dispatch(getAllArtistAlbumsDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}

export const getAllArtistAlbumsForDasboardProfileDispatch = (data) => {
    return dispatch => {
        dispatch({type: GET_ALL_ARTIST_ALBUMS_FOR_DASHBOARD_PROFILE, data});
    }
}


export const getAllArtistAlbumsForDasboardProfileAction = (token, artistId) => {
    return async dispatch => {       
        const response = await fetch(baseIpRequest.ServerAddress + '/album/getAllArtistAlbums/' + artistId, {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            
        })
        const data = await response.json();
        if(data) {
            dispatch(getAllArtistAlbumsForDasboardProfileDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}

export const cleanAlbumReducerDispatch = () => {
    return dispatch => {
        dispatch({type: CLEAN_ALBUM_REDUCER});
    }
}

export const cleanAlbumReducerAction = () => {
    return dispatch => {
        dispatch(cleanAlbumReducerDispatch());
    }
}


export const createNewAlbumsDispatch = (data) => {
    return dispatch => {
        dispatch({type: CREATE_NEW_ALBUM, data});
    }
}


export const createNewAlbumsAction = (token, artistId, album) => {
    return async dispatch => {       
        const response = await fetch(baseIpRequest.ServerAddress + '/album/createNewAlbum/' + artistId, {
            method:'POST',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({album: album})
        })
        const data = await response.json();
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        if(data) {
            dispatch(createNewAlbumsDispatch(data));
            return data;
        } else {
            throw new Error('Something went wrong');
        }
    }
}




