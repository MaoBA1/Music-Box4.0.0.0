export const GET_GENERS = 'GET_GENERS';

import baseIpRequest from '../../src/ServerDev';



export const getGenersDispatch = data => {
    return dispatch => {
        dispatch({type: GET_GENERS, data});
    }

} 


export const getGenersAction = () =>{ 
    return async dispatch => {        
        const response = await fetch(baseIpRequest.ServerAddress + '/gener/getAllAppGeners', {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
            }            
        })
        const data = await response.json(); 
        if(data){
            dispatch(getGenersDispatch(data));
        } else {
            throw new Error('Something went wrong');
        }
    }
}