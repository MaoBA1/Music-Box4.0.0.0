export const GET_ALL_POST = 'GET_ALL_POST';
export const GET_POST_COMMENTS = 'GET_POST_COMMENTS';
export const LIKE = "LIKE";
export const UNLIKE = "UNLIKE";
export const SEND_COMMENT = "SEND_COMMENT";
export const UPLOAD_NEW_POST = "UPLOAD_NEW_POST";
export const GET_ALL_ARTIST_POST_BY_ID = "GET_ALL_ARTIST_POST_BY_ID";
export const GET_ALL_ARTIST_POST_FOR_DASHBOARD_PROFILE = "GET_ALL_ARTIST_POST_FOR_DASHBOARD_PROFILE";
export const CLEAN_ARTIST_POST_FOR_DASHBOARD_PROFILE = "CLEAN_ARTIST_POST_FOR_DASHBOARD_PROFILE";
export const DELETE_ARTIST_POST ="DELETE_ARTIST_POST";

import baseIpRequest from '../../src/ServerDev';



export const getAllPostsDispatch = data => {
    return dispatch => {
        dispatch({type: GET_ALL_POST, data});
    }

} 


export const getAllPostsAction = token =>{ 
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/post/getAllPosts', {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }            
        })
        const data = await response.json(); 
        if(data){
            dispatch(getAllPostsDispatch(data));
        } else {
            throw new Error('Something went wrong');
        }
    }
}


export const likeDispatch = data => {
    return dispatch => {
        dispatch({type: LIKE, data});
    }

} 


export const likeAction = (token, postId) =>{ 
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/post/likePost/' + postId, {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            } 
        })

        const data = await response.json(); 
        if(data){
            dispatch(likeDispatch(data));
            if (data.status) {
                return true;
            }
        } else {
            throw new Error('Something went wrong');
        }
    }
}

export const unLikeDispatch = data => {
    return dispatch => {
        dispatch({type: UNLIKE, data});
    }

} 


export const unLikeAction = (token, postId) =>{ 
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress +'/post/unlikePost/' + postId, {
            method:'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            } 
        })

        const data = await response.json(); 
        if(data){
            dispatch(unLikeDispatch(data));
            if (data.status) {
                return true;
            }
        } else {
            throw new Error('Something went wrong');
        }
    }
}





export const getPostCommentsDispatch = data => {
    return dispatch => {
        dispatch({type: GET_POST_COMMENTS, data});
    }

} 


export const getPostCommentsAction = (token,postId) => {
    return async dispatch => {
        const response = await fetch(baseIpRequest.ServerAddress + '/post/getPostComments/' + postId, {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json();
        if(data){
            dispatch(getPostCommentsDispatch(data));
        } else {
            throw new Error('Something went wrong'); 
        }
    }
}



export const sendCommentsDispatch = data => {
    return dispatch => {
        dispatch({type: SEND_COMMENT, data});
    }

} 


export const sendCommentsAction = (token, postId, commentText) => {
    return async dispatch => {
        const response = await fetch(baseIpRequest.ServerAddress + '/post/sendComment/' + postId,{
            method: 'PUT',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }, 
            body: JSON.stringify({comment: commentText})
        })
        const data = await response.json();
        if(data){
            dispatch(sendCommentsDispatch(data));
            return true;
        } else {
            throw new Error('Something went wrong'); 
        }
    }
}


export const uploadNewPostDispatch = data => {
    return dispatch => {
        dispatch({type: UPLOAD_NEW_POST, data});
    }

} 


export const uploadNewPostAction = (token, details) => {
    return async dispatch => {
        const response = await fetch(baseIpRequest.ServerAddress + '/post/uploadNewPost',{
            method: 'POST',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }, 
            body: JSON.stringify(details)
        })
        const data = await response.json();
        if(data){
            dispatch(uploadNewPostDispatch(data));
            return true;
        } else {
            throw new Error('Something went wrong'); 
        }
    }
}

export const getAllArtistPostsByIdDispatch = data => {
    return dispatch => {
        dispatch({type: GET_ALL_ARTIST_POST_BY_ID, data});
    }

} 


export const getAllArtistPostsByIdAction = (token, artistId) => {
    return async dispatch => {
        const response = await fetch(baseIpRequest.ServerAddress + '/post/getAllArtistPosts/' + artistId,{
            method: 'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json();
        if(data){
            dispatch(getAllArtistPostsByIdDispatch(data));
            return true;
        } else {
            throw new Error('Something went wrong'); 
        }
    }
}



export const getAllArtistPostsForDashBoardProfileDispatch = data => {
    return dispatch => {
        dispatch({type: GET_ALL_ARTIST_POST_FOR_DASHBOARD_PROFILE, data});
    }

} 


export const getAllArtistPostsForDashBoardProfileAction = (token, artistId) => {
    return async dispatch => {
        const response = await fetch(baseIpRequest.ServerAddress + '/post/getAllArtistPosts/' + artistId,{
            method: 'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json();
        if(data){
            dispatch(getAllArtistPostsForDashBoardProfileDispatch(data));
            return true;
        } else {
            throw new Error('Something went wrong'); 
        }
    }
}

export const cleanArtistPostsForDashBoardProfileDispatch = () => {
    return dispatch => {
        dispatch({type: CLEAN_ARTIST_POST_FOR_DASHBOARD_PROFILE});
    }

} 

export const cleanArtistPostsForDashBoardProfileAction = () => {
    return dispatch => {
        dispatch(cleanArtistPostsForDashBoardProfileDispatch());
    }

} 

export const deleteArtistPostDispatch = (data) => {
    return dispatch => {
        dispatch({type: DELETE_ARTIST_POST, data});
    }
}

export const deleteArtistPostAction = (token, postId) => {
    return async dispatch => {
        const response = await fetch(baseIpRequest.ServerAddress + '/post/deletePost/' + postId, {
            method: 'DELETE',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        const data = await response.json();
        if(data) {
            dispatch(deleteArtistPostDispatch(data));
        } else{
            throw new Error('Something went wrong'); 
        }

    }
}