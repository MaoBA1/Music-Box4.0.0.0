import { 
    SET_MUSIC_ON_BACK_GROUND,
    PLAY_FOR_FIRST_TIME,
    PAUSE_SONG,
    RESUME_SONG,
    PLAY_NEXT_SONG,
    PREPER_NEXT_SONG,
    HANDLE_SEE_BAR,
    SET_MUSIC_ON_FORGROUND,
    SWITCH_BETEEN_DASHBOARDS,
    SET_POST_AUTHOR_PROFILE,
    SET_UPLOAD_COMPLETE,
    SET_IS_WATING_FOR_UPLOAD
 } from '../actions/appActions';


const initialState = {
    MusicOnBackGroundReducer:false,
    SongOnBackGroundReducer:null,
    SongIndexReducer: null,
    isPlaying: false,
    soundObj: null,
    playbackObj: null,
    currentAudio: {},
    playbackPosition: null,
    playbackDuration: null,
    isLoading: false,
    MusicOnForGroundReducer: false,
    main: true,
    PostAuthorProfile: null,
    isWaitingForUpload:false,
    isUploadComplete:null,
    uploadType: null,
}



export default (state = initialState, action) => {       
    switch (action.type) {
        case SET_MUSIC_ON_BACK_GROUND:
            return {
                ...state,
                MusicOnBackGroundReducer: action.boolean
            }
        case PLAY_FOR_FIRST_TIME:
           return {
                ...state,
                playbackObj: action.playbackObj,
                soundObj: action.status,
                currentAudio: action.currentAudio,
                isPlaying: action.isPlaying,
                SongIndexReducer: action.index,
                SongOnBackGroundReducer: action.list,
                MusicOnBackGroundReducer: action.musicOnBackGround,
                isLoading: action.isLoading,
                MusicOnForGroundReducer: action.MusicOnForGroundReducer
            }
        case PAUSE_SONG:
            return {
                ...state,
                soundObj: action.status,
                isPlaying: action.isPlaying,
            }
        case RESUME_SONG:
            return {
                ...state,
                soundObj: action.status,
                isPlaying: action.isPlaying,
            }
        case PLAY_NEXT_SONG:
            return{
                ...state,
                soundObj: action.status,
                currentAudio: action.currentAudio,
                isPlaying: action.isPlaying,
                SongIndexReducer: action.index,
                isLoading: action.isLoading,
                MusicOnForGroundReducer: action.MusicOnForGroundReducer,
                SongOnBackGroundReducer: action.list
            }
        case PREPER_NEXT_SONG:
            return {
                ...state,
                currentAudio: action.currentAudio,
                isPlaying: action.isPlaying,
                SongIndexReducer: action.index,
                isLoading: action.isLoading
            }
        case HANDLE_SEE_BAR:
            return {
                ...state,
                playbackPosition: action.playbackPosition,
                playbackDuration: action.playbackDuration, 
            }
        case SET_MUSIC_ON_FORGROUND: 
            return {
                ...state,
                MusicOnForGroundReducer: action.boolean
            }
        case SWITCH_BETEEN_DASHBOARDS:
            return {
                ...state,
                main: action.boolean
            }
        case SET_POST_AUTHOR_PROFILE:
            return {
                ...state,
                PostAuthorProfile: action.profile
            }
        case SET_IS_WATING_FOR_UPLOAD:
            return {
                ...state,
                isWaitingForUpload: action.isWaiting,
                uploadType: action.uploadType,
            }
        case SET_UPLOAD_COMPLETE:
            return {
                ...state,
                isWaitingForUpload: action.isWaiting,
                uploadType: action.uploadType,
                isUploadComplete: action.isComplete
            }
        default:
            return state;
    }
}

