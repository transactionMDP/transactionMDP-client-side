import { USER_DATA_REQUESTED, AUTH_STATE } from "../constants/action-types";

export function getCurrentUser() {
    return { type: USER_DATA_REQUESTED };
}

export function setAuthState(payload) {
    return { type: AUTH_STATE, payload: payload }
}
