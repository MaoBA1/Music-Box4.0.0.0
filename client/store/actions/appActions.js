export const SET_MUSIC_ON_BACK_GROUND = "SET_MUSIC_ON_BACK_GROUND";
export const PLAY_FOR_FIRST_TIME = "PLAY_FOR_TIME";
export const PAUSE_SONG = "PAUSE_SONG";
export const RESUME_SONG = "RESUME_SONG";
export const PLAY_NEXT_SONG = "PLAY_NEXT_SONG";
export const PREPER_NEXT_SONG = "PREPER_NEXT_SONG";
export const HANDLE_SEE_BAR = "HANDLE_SEE_BAR";
export const SET_MUSIC_ON_FORGROUND = "SET_MUSIC_ON_FORGROUND";
export const SWITCH_BETEEN_DASHBOARDS = "SWITCH_BETEEN_DASHBOARDS";
export const SET_POST_AUTHOR_PROFILE = "SET_POST_AUTHOR_PROFILE";
export const SET_IS_WATING_FOR_UPLOAD = "SET_IS_WATING_FOR_UPLOAD";
export const SET_UPLOAD_COMPLETE = "SET_UPLOAD_COMPLETE";


export const setIsWaitingForUploadDispatch = (isWaiting, type) => {
    return dispatch => {
        dispatch({type: SET_IS_WATING_FOR_UPLOAD, isWaiting: isWaiting, uploadType: type})
    }
}

export const setIsWaitingForUploadAction = (isWaiting, type) => {
    return dispatch => {
        dispatch(setIsWaitingForUploadDispatch(isWaiting, type));
    }
}

export const setIsUploadCompleteDispatch = (isComplete, isWaiting, type) => {
    return dispatch => {
        dispatch({type: SET_UPLOAD_COMPLETE, isComplete, isWaiting, uploadType: type})
    }
}

export const setIsUploadCompleteAction = (isComplete, isWaiting, type) => {
    return dispatch => {
        dispatch(setIsUploadCompleteDispatch(isComplete, isWaiting, type));
    }
}




export const setMusicOnBackGroundDispatch = (boolean) => {
    return dispatch => {
        dispatch({type: SET_MUSIC_ON_BACK_GROUND, boolean});
    }
}

export const setMusicOnBackGroundAction = (boolean) => {
    return dispatch => {
        dispatch(setMusicOnBackGroundDispatch(boolean));
    }
}

export const playInTheFirstTimeDispatch = ({
    playbackObj,
    status,
    currentAudio,
    isPlaying,
    index,
    list,
    musicOnBackGround,
    isLoading,
    MusicOnForGroundReducer
}) => {
    return dispatch =>  {
        dispatch({
            type:PLAY_FOR_FIRST_TIME, 
            playbackObj,
            status,
            currentAudio,
            isPlaying,
            index,
            list,
            musicOnBackGround,
            isLoading,
            MusicOnForGroundReducer
        })
    }
}

export const playInTheFirstTimeAction = (params) => {
    return dispatch => {
        dispatch(playInTheFirstTimeDispatch(params));
    }
}

export const pauseSongDispatch = ({status, isPlaying}) => {
    return dispatch => {
        dispatch({
            type: PAUSE_SONG,
            status,
            isPlaying
        });
    }
}

export const pauseSongAction = (params) => {
    return dispatch => {
        dispatch(pauseSongDispatch(params));
    }
}

export const resumeSongDispatch = ({status, isPlaying}) => {
    return dispatch => {
        dispatch({
            type: RESUME_SONG,
            status,
            isPlaying
        });
    }
}

export const resumeSongAction = (params) => {
    return dispatch => {
        dispatch(resumeSongDispatch(params));
    }
}

export const playNextSongDispatch = ({
    status,
    currentAudio,
    isPlaying,
    index,
    isLoading,
    MusicOnForGroundReducer,
    list
}) => {
    return dispatch => {
        dispatch({
            type: PLAY_NEXT_SONG,
            status,
            currentAudio,
            isPlaying,
            index,
            isLoading,
            MusicOnForGroundReducer,
            list
        })
    }
}


export const playNextSongAction = (params) => {
    return dispatch => {
        dispatch(playNextSongDispatch(params));
    }
}

export const preperNextSongDispatch = ({
    currentAudio,
    isPlaying,
    index,
    isLoading
}) => {
    return dispatch => {
        dispatch({
            type: PREPER_NEXT_SONG,
            currentAudio,
            isPlaying,
            index,
            isLoading
        })
    }
}

export const preperNextSongAction = params => {
    return dispatch => {
        dispatch(preperNextSongDispatch(params));
    }
}

export const handleSeeBarDispatch = ({playbackPosition, playbackDuration}) => {
    return dispatch => {
        dispatch({
            type: HANDLE_SEE_BAR,
            playbackPosition,
            playbackDuration
        })
    }
}

export const handleSeeBarAction = params => {
    return dispatch => {
        dispatch(handleSeeBarDispatch(params));
    }
}

export const setMusicOnForGroundDispatch = (boolean) => {
    return dispatch => {
        dispatch({type: SET_MUSIC_ON_FORGROUND, boolean});
    }
}

export const setMusicOnForGroundAction = (boolean) => {
    return dispatch => {
        dispatch(setMusicOnForGroundDispatch(boolean))
    }
}

export const SwitchBetweenDashBoardStacksDispatch = (boolean) => {
    return dispatch => {
        dispatch({type: SWITCH_BETEEN_DASHBOARDS, boolean});
    }
}


export const SwitchBetweenDashBoardStacksAction = (boolean) => {
    return dispatch => {
        dispatch(SwitchBetweenDashBoardStacksDispatch(boolean));
    }
}

export const setPostAuthorProfileDispatch = (profile) => {
    return dispatch => {
        dispatch({type: SET_POST_AUTHOR_PROFILE, profile});
    }
}


export const setPostAuthorProfileAction = (profile) => {
    return dispatch => {
        dispatch(setPostAuthorProfileDispatch(profile));
    }
}