import { USER_DATA_LOADED, AUTH_STATE } from "../constants/action-types";

const initialState = {
    currentUser: null,
    isAuthenticated: false,
};

function rootReducer(state = initialState, action) {
    if (action.type === USER_DATA_LOADED) {
        return Object.assign({}, state, {
            currentUser: action.payload
        });
    }
    if (action.type === AUTH_STATE) {
        return Object.assign({}, state, {
            isAuthenticated: action.payload
        });
    }
    return state;
}
export default rootReducer;
