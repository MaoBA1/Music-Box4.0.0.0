import { GET_GENERS } from '../actions/genersActions';

const initialState = null;


export default (state = initialState, action) => {       
    switch (action.type){
        case GET_GENERS:
            return {
                ...state,       
                GenerReducer: action.data
            }
        default:
            return state;
    }
}