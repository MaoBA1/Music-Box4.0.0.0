import { 
    GET_ALL_POST,
    GET_POST_COMMENTS,
    GET_ALL_ARTIST_POST_BY_ID,
    GET_ALL_ARTIST_POST_FOR_DASHBOARD_PROFILE ,
    CLEAN_ARTIST_POST_FOR_DASHBOARD_PROFILE,
    SET_POST_AUTHOR_PROFILE
} from '../actions/postActions';

const initialState = {
    PostReducer:null,
    postCommentReducer:null,
    ArtistPostsReducer:null,
    DashBoardProfilePostReducer:null,
};


export default (state = initialState, action) => {       
    switch (action.type){
        case GET_ALL_POST:
            return {
                ...state,       
                PostReducer: action.data.Posts
            }
        case GET_POST_COMMENTS:
            return{
                ...state,  
                postCommentReducer: action.data.postComments
            }
        case GET_ALL_ARTIST_POST_BY_ID:
            return{
                ...state,  
                ArtistPostsReducer: action.data.Posts
            }
        case GET_ALL_ARTIST_POST_FOR_DASHBOARD_PROFILE:
            return{
                ...state,  
                DashBoardProfilePostReducer: action.data.Posts
            }
        case CLEAN_ARTIST_POST_FOR_DASHBOARD_PROFILE:
            return{
                ...state,
                DashBoardProfilePostReducer: null
            }
        case SET_POST_AUTHOR_PROFILE:
            return{
                ...state, 
                ArtistPostsReducer:action.profile
            }
        default:
            return state;
    }
}