import { takeEvery, call, put } from "redux-saga/effects";
import { USER_DATA_REQUESTED, USER_DATA_LOADED, API_ERRORED } from "../constants/action-types";
import {getCurrentUser} from "../../util/APIs";

export default function* watcherSaga() {
    yield takeEvery( USER_DATA_REQUESTED, workerSaga);
}

function* workerSaga() {
    try {
        const payload = yield call(getCurrentUser);
        yield put({ type: USER_DATA_LOADED, payload });
    } catch (e) {
        yield put({ type: API_ERRORED, payload: e });
    }
}
