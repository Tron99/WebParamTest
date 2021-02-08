import {GET_RAND_JOKE,GET_BY_CATEGORY,GET_CATEGORY, SET_JOKE} from '../types/index'

import { createApolloFetch } from 'apollo-fetch';
import axios from 'axios'
import {GET_RAND_JOKE_GQL,GET_JOKE_BY_CATEGORY_GQL,CATEGORIES_GQL} from '../Queries'


export const jokesReducer = (state={}, action) =>{
    switch(action.type){
        case GET_CATEGORY:
               return Object.assign({}, state, {categories:action.payload})
        case GET_RAND_JOKE:
        return state;
        
            case SET_JOKE:
                return Object.assign({}, state, {joke:action.payload})
        default:
            return state
    }
}



export default jokesReducer