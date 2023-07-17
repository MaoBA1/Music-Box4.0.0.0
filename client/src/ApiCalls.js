import { 
    getAllArtistsAction,
    createArtistAction,
    getArtistDataAction,
    getArtistPlaylistAction,
    getArtistPlaylistForDashBoardAction,
    cleanPlaylistReducerAction,
    deleteArtistAlbumAction,
    deleteArtistPlaylistAction,
    addAdditionalSongsToArtistPlaylistAction,
    getArtistsByUserFavoriteGenersAction,
    addAdditionalSongsToArtistAlbumAction
} from '../store/actions/artistActions';
import { getGenersAction } from '../store/actions/genersActions';
import { 
    getAllPostsAction,
    likeAction,
    unLikeAction,
    getPostCommentsAction,
    sendCommentsAction, getAllArtistPostsByIdAction ,
    getAllArtistPostsForDashBoardProfileAction,
    cleanArtistPostsForDashBoardProfileAction
} from '../store/actions/postActions';
import {
     getAllArtistSongsAction,
     getArtistTop5SongsAction,
     getArtistLatestRealeasesAction,
     getAllArtistSongsForDashBoardProfileAction,
     getArtistTop5SongsForDashBoardProfileAction,
     getArtistLatestRealeasesForDashBoardProfileAction,
     cleanSongReducerAction,
     getAllSongsAction
 } from '../store/actions/songActions';
 import {
    getAllArtistAlbumsForDasboardProfileAction,
    cleanAlbumReducerAction,
    getAllArtistAlbumsAction
 } from '../store/actions/albumsActions';
 import { getUserDataAction, updateProfileAction, getAllUserPlaylistsAction, getAllUserSubScribesAction, getAllSearchResultsAction } from '../store/actions/userActions';
 import { getSongsByUserFavoriteGenersAction } from '../store/actions/songActions';
 import { setIsUploadCompleteAction, setIsWaitingForUploadAction, setPostAuthorProfileAction } from '../store/actions/appActions';
 import { deleteUserPlaylistAction, deleteSongFromUserPlaylistAction } from '../store/actions/userActions';

export const setIsUploadComplete = (dispatch, isComplete, isWaiting, type) => {
    let action = setIsUploadCompleteAction(isComplete, isWaiting, type);
    try {
        dispatch(action);
    }catch(error) {
        console.log(error.message);
    }
}

export const setIsWaitingForUpload = (dispatch, isWaiting, type) => {
    let action = setIsWaitingForUploadAction(isWaiting, type);
    try{
        dispatch(action);
    }catch(error) {
        console.log(error.message);
    }
}


export const getAllAppGeners = async(dispatch) => {
    let action = getGenersAction();   
    try{
        await dispatch(action);
    } catch(error) {
        console.log(error);
    }
};


export const getPosts = async(dispatch, token) => {
    let action = getAllPostsAction(token);
    try{
        await dispatch(action);
    } catch(error) {
        console.log(error);
    }
};


export const getArtists = async(dispatch, token) => {
    let action = getAllArtistsAction(token)
    try{
        await dispatch(action);
    } catch(error) {
        console.log(error);
    }
}; 

export const createArtist = async(dispatch, token, details) => {
    
    let action = createArtistAction(token, details);
    try{
        await dispatch(action)
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            return error;
        })
    } catch(error) {
        return error;
    }
}



export const getUserData = async(dispatch, token) => {
    let action = getUserDataAction(token)
    try{
        await dispatch(action)
    } catch(error) {
        console.log(error);
    }
};

export const getArtistData = async(dispatch, token) => {
    let action = getArtistDataAction(token)
    try{
        await dispatch(action)
    } catch(error) {
        console.log(error);
    }
};



export const giveLikeToPost = async(dispatch, token, postId) => {
    let action = likeAction(token, postId);
    try {
        await dispatch(action)
        .then(result => {return result});
    } catch(error) {
        console.log(error);
    }
}

export const unLikeToPost = async(dispatch, token, postId) => {
    let action = unLikeAction(token, postId);
    try {
        await dispatch(action)
        .then(result => {return result});
    } catch(error) {
        console.log(error);
    }
}



export const getPostComment = async(dispatch, token, postId) => {
    let action = getPostCommentsAction(token, postId);
    try{
        await dispatch(action); 
        
    } catch (error) {
        console.log(error.message);
        
    }
};


export const giveCommentToPost = async(dispatch, token, postId, commentText) => {
    let action = sendCommentsAction(token, postId, commentText);
    try {
        await dispatch(action)
        .then(result => {
            if(result) {
                getPosts(dispatch, token);
                getPostComment(dispatch, token, postId);
            }
        });
    } catch(error) {
        console.log(error.message);
    }
}

export const updateRegularProfile = async(dispatch, token, details) => {
    let action = updateProfileAction(token, details);
    try {
        await dispatch(action)
        .then(result => {
            if (result) {
                getUserData(dispatch, token);
                return result;
            }
        })
    } catch(error) {
        console.log(error.message);
    }
}

export const getArtistPostsById = async(dispatch, token, artistId) => {
    let action = getAllArtistPostsByIdAction(token, artistId);
    try {
        await dispatch(action);
    } catch(error) {
        console.log(error.message);
    }
}

export const getArtistPostsForDashboardProfileById = async(dispatch, token, artistId) => {
    let action = getAllArtistPostsForDashBoardProfileAction(token, artistId);
    try {
        await dispatch(action);
    } catch(error) {
        console.log(error.message);
    }
}

export const cleanArtistPostsForDashboardProfil = async(dispatch) => {
    let action = cleanArtistPostsForDashBoardProfileAction();
    try {
        await dispatch(action);
    } catch(error) {
        console.log(error.message);
    }
}




export const getAllArtistSongs = async(dispatch, token, artistId) => {
    let action = getAllArtistSongsAction(token, artistId);
    try{
        await dispatch(action)
        .then(result => {
            
        })
    } catch(error) {
        console.log(error.message);
    }
}


export const getArtistTop5 = async(dispatch, token, artistId) => {
    let action = getArtistTop5SongsAction(token, artistId);
    try{
        await dispatch(action)
        .then(result => {
            return result;
        })
    }
    catch(error) {
        console.log(error.message);
    }
}

export const getArtistLatestRealeases = async(dispatch, token, artistId) => {
    let action = getArtistLatestRealeasesAction(token, artistId);
    try{
        await dispatch(action)
        .then(result => {
            return result;
        })
    }catch(error) {
        console.log(error.message);
    }
}

export const getArtistPlayLists = async(dispatch, token) => {
    let action = getArtistPlaylistAction(token);
    try {
        await dispatch(action)        
    } catch(error) {
        console.log(error.message);
    }
}



export const getAllArtistSongsForDashBoardProfil = async(dispatch, token, artistId) => {
    let action = getAllArtistSongsForDashBoardProfileAction(token, artistId);
    try{
        await dispatch(action)
        .then(result => {
            
        })
    } catch(error) {
        console.log(error.message);
    }
}


export const getArtistTop5ForDashBoardProfil = async(dispatch, token, artistId) => {
    let action = getArtistTop5SongsForDashBoardProfileAction(token, artistId);
    try{
        await dispatch(action)
        .then(result => {
            return result;
        })
    }
    catch(error) {
        console.log(error.message);
    }
}

export const getArtistLatestRealeasesForDashBoardProfil = async(dispatch, token, artistId) => {
    let action = getArtistLatestRealeasesForDashBoardProfileAction(token, artistId);
    try{
        await dispatch(action)
        .then(result => {
            return result;
        })
    }catch(error) {
        console.log(error.message);
    }
}


export const cleanSongReducers = (dispatch) => {
    let action = cleanSongReducerAction();
    try {
        dispatch(action);
    } catch(error) {
        console.log(error.message);
    }
}

export const getArtistPlayListsForDashBoardProfile = async(dispatch, token, artistId) => {
    let action = getArtistPlaylistForDashBoardAction(token, artistId);
    try {
        await dispatch(action)        
    } catch(error) {
        console.log(error.message);
    }
}

export const cleanPlaylistReducer = (dispatch) => {
    let action = cleanPlaylistReducerAction();
    try {
        dispatch(action)        
    } catch(error) {
        console.log(error.message);
    }
}

export const getAllArtistAlbumsForDashBoardProfile = async(dispatch, token, artistId) => {
    let action = getAllArtistAlbumsForDasboardProfileAction(token, artistId);
    try{
        await dispatch(action);
    }catch(error) {
        console.log(error.message);
    }
}


export const cleanAlbumReducer = (dispatch) => {
    let action = cleanAlbumReducerAction();
    try{
        dispatch(action);
    }catch(error) {
        console.log(error.message);
    }
}



export function cleanArtistProfilePageBeforeNextUse(dispatch){
    try{
        dispatch(setPostAuthorProfileAction(null));
    } catch (error) {
        console.log();
    }
}

export async function getArtistDataAsync(dispatch, token, isSuperUser){
    if(isSuperUser) {
        getArtistData(dispatch, token);
    }
}


export async function getAllUserSubScribes(dispatch, token) {
    let action = getAllUserSubScribesAction(token);
    try{
        await dispatch(action);
    }catch (error) {
        console.log(error.message);
    }
}


export async function getAllUserPlaylist(dispatch, token){
    let action = getAllUserPlaylistsAction(token);
    try{
        await dispatch(action);
    }catch (error) {
        console.log(error.message);
    }
}
export async function getSongsByUserFavoriteGeners(dispatch, token){
    let action = getSongsByUserFavoriteGenersAction(token);
    try{
        await dispatch(action);
    }catch (error) {
        console.log(error.message);
    }
}


export async function getArtistsByUserFavoriteGeners(dispatch, token){
    let action = getArtistsByUserFavoriteGenersAction(token);
    try{
        await dispatch(action);
    }catch (error) {
        console.log(error.message);
    }
}


export async function getAllSearchResults(dispatch, token){
    let action = getAllSearchResultsAction(token);
    try{
        await dispatch(action);
    }catch (error) {
        console.log(error.message);
    }
}

export const getAllArtistAlbums = async(dispatch, token, artistId) => {
    let action = getAllArtistAlbumsAction(token, artistId);
    try {
         await dispatch(action);
    }catch (error) {
        console.log(error.message);
    }
}

export const setPostAuthorProfile = (dispatch, artist) => {
    console.log(artist);
    let action = setPostAuthorProfileAction(artist);
    try {
        dispatch(action);
    }catch (error) {
        console.log(error.message);
    }
}




export const deleteArtistAlbum = async(dispatch, token, artistId, albumId) => {
    let action = deleteArtistAlbumAction(token, artistId, albumId);
    try {
        await dispatch(action);
    } catch (error) {
        console.log(error.message);
    }
}


export const deleteArtistPlaylist = async(dispatch, token, artistId, playlistId) => {
    let action = deleteArtistPlaylistAction(token, artistId, playlistId);
    try {
        await dispatch(action);
    } catch (error) {
        console.log(error.message);
    }
}

export const addAdditionalSongsToArtistPlaylist = async(dispatch, token, artistId, playlistId, songs) => {
    let action = addAdditionalSongsToArtistPlaylistAction(token, artistId, playlistId, songs);
    try{
        await dispatch(action);
    } catch (error) {
        console.log(error.message);
    }
}

export const addAdditionalSongsToArtistAlbum = async(dispatch, token, artistId, albumId, songs) => {
    let action = addAdditionalSongsToArtistAlbumAction(token, artistId, albumId, songs);
    try{
        await dispatch(action);
    } catch (error) {
        console.log(error.message);
    }
}


export const deleteUserPlaylist = async(dispatch, token, playlistId) => {
    let action = deleteUserPlaylistAction(token, playlistId);
    try{
        await dispatch(action);
    }catch (error) {
        console.log(error.message);
    }
}

export const deleteSongFromUserPlaylist = async(dispatch, token, playlistId, songName) => {
    let action = deleteSongFromUserPlaylistAction(token, playlistId, songName);
    try{
        await dispatch(action);
    }catch (error) {
        console.log(error.message);
    }
}

export const getAllAppSongs = async(dispatch, token) => {
    let action = getAllSongsAction(token);
    try {
        await dispatch(action);
    } catch (error) {
        console.log(error.message);
    }
}