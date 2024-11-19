import { call, put, takeEvery } from "redux-saga/effects"

import { GET_JOB_LIST, ADD_NEW_JOB_LIST, UPDATE_JOB_LIST, DELETE_JOB_LIST, GET_APPLY_JOB, DELETE_APPLY_JOB } from "./actionTypes";
import {
    getJobListSuccess,
    getJobListFail,
    addJobListSuccess,
    addJobListFail,
    updateJobListSuccess,
    updateJobListFail,
    deleteJobListSuccess,
    deleteJobListFail,
    getApplyJobSuccess,
    getApplyJobFail,
    deleteApplyJobSuccess,
    deleteApplyJobFail
} from "./actions"

import {
    getJobList,
    addNewJobList,
    updateJobList,
    deleteJobList,
    getApplyJob,
    deleteApplyJob
} from "helpers/fakebackend_helper";
import { toast } from "react-toastify";

function* fetchJobsList() {
    try {
        const response = yield call(getJobList)
        yield put(getJobListSuccess(response))
    } catch (error) {
        yield put(getJobListFail(error))
    }
}

function* onAddNewJobList({ payload: data }) {
    try {
        const response = yield call(addNewJobList, data)
        yield put(addJobListSuccess(response))
        toast.success("Job List Added Successfully", { autoClose: 2000 });
    } catch (error) {
        yield put(addJobListFail(error))
        toast.error("Job List Added Failed", { autoClose: 2000 });
    }
}

function* onUpdateJobList({ payload: data }) {
    try {
        const response = yield call(updateJobList, data)
        yield put(updateJobListSuccess(response))
        toast.success("Job List Updated Successfully", { autoClose: 2000 });
    } catch (error) {
        yield put(updateJobListFail(error))
        toast.error("Job List Updated Failed", { autoClose: 2000 });
    }
}

function* onDeleteJobList({ payload: data }) {

    try {
        const response = yield call(deleteJobList, data)
        yield put(deleteJobListSuccess(response))
        toast.success("Job List Deleted Successfully", { autoClose: 2000 });
    } catch (error) {
        yield put(deleteJobListFail(error))
        toast.error("Job List Deleted Failed", { autoClose: 2000 });
    }
}

function* OnGetApplyJob() {
    try {
        const response = yield call(getApplyJob)
        yield put(getApplyJobSuccess(response))

    } catch (error) {
        yield put(getApplyJobFail(error))

    }
}

function* OnDeleteApplyJob({ payload: data }) {
    try {
        const response = yield call(deleteApplyJob, data)
        yield put(deleteApplyJobSuccess(response))
        toast.success("Applyed Job Deleted Successfully", { autoClose: 2000 });
    } catch (error) {
        yield put(deleteApplyJobFail(error))
        toast.error("Applyed Job Deleted Failed", { autoClose: 2000 });
    }
}

function* jobsSaga() {
    yield takeEvery(GET_JOB_LIST, fetchJobsList)
    yield takeEvery(ADD_NEW_JOB_LIST, onAddNewJobList)
    yield takeEvery(UPDATE_JOB_LIST, onUpdateJobList)
    yield takeEvery(DELETE_JOB_LIST, onDeleteJobList)
    yield takeEvery(GET_APPLY_JOB, OnGetApplyJob)
    yield takeEvery(DELETE_APPLY_JOB, OnDeleteApplyJob)
}

export default jobsSaga;