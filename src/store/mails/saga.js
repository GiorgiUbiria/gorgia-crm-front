import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_MAILS_LIST,
  GET_MAILS_ID,
  GET_SELECTED_MAILS,
  SET_FOLDER_SELECTED_MAILS,
  SELECT_FOLDER,
  UPDATE_MAIL,
  DELETE_MAIL,
  TRASH_MAIL,
  STARED_MAIL,
} from "./actionTypes";

import {
  getMailsListsSuccess,
  getMailsListsFail,
  getMailsListsIdSuccess,
  getMailsListsIdFail,
  getSelectedMailsSuccess,
  getSelectedMailsFail,
  setFolderOnSelectedMailsSuccess,
  setFolderOnSelectedMailsFail,
  selectFoldersSuccess,
  selectFoldersFail,
  updateMailSuccess,
  updateMailFail,
  deleteMailSuccess,
  deleteMailFail,
  trashMailFail,
  trashMailSuccess,
  staredMailSuccess,
  staredMailFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getMailsLists,
  getMailsListsId,
  getselectedmails,
  setfolderonmails,
  selectFolders,
  updateMail,
  deleteMail,
  trashMail,
  staredMail
} from "helpers/fakebackend_helper";

function* fetchMailsLists({ payload: filter }) {
  try {
    const response = yield call(getMailsLists, filter);
    yield put(getMailsListsSuccess(response));
  } catch (error) {
    yield put(getMailsListsFail(error));
  }
}

function* fetchMailsListsId({ payload: filter }) {
  try {
    const response = yield call(getMailsListsId, filter);
    yield put(getMailsListsIdSuccess(response));
  } catch (error) {
    yield put(getMailsListsIdFail(error));
  }
}

function* onSelectFolders() {
  try {
    const response = yield call(selectFolders);
    yield put(selectFoldersSuccess(response));
  } catch (error) {
    yield put(selectFoldersFail(error));
  }
}

function* onGetSelectedMails({ payload: selectedmails }) {
  try {
    const response = yield call(getselectedmails, selectedmails);
    yield put(getSelectedMailsSuccess(response));
  } catch (error) {
    yield put(getSelectedMailsFail(error));
  }
}

function* onSetFolderOnSelectedMails({ payload: { selectedmails, folderId, activeTab } }) {
  try {
    const response = yield call(setfolderonmails, selectedmails, folderId);
    yield put(setFolderOnSelectedMailsSuccess(response));

    try {
      const newresponse = yield call(getMailsLists, parseInt(activeTab));
      yield put(getMailsListsSuccess(newresponse));
    } catch (error) {
      yield put(getMailsListsFail(error));
    }

    try {
      const response = yield call(getselectedmails, null);
      yield put(getSelectedMailsSuccess(response));
    } catch (error) {
      yield put(getSelectedMailsFail(error));
    }

  } catch (error) {
    yield put(setFolderOnSelectedMailsFail(error));
  }
}

function* onUpdateMail({ payload: mail }) {
  try {
    const response = yield call(updateMail, mail)
    yield put(updateMailSuccess(response));
  } catch (error) {
    yield put(updateMailFail(error))
  }
}

function* onDeleteMail({ payload: mail }) {
  try {
    const response = yield call(deleteMail, mail)
    yield put(deleteMailSuccess(response));
  } catch (error) {
    yield put(deleteMailFail(error))
  }
}

function* onTrashMail({ payload: mail }) {
  try {
    const response = yield call(trashMail, mail)
    yield put(trashMailSuccess(response));
  } catch (error) {
    yield put(trashMailFail(error))
  }
}

function* onStaredMail({ payload: mail }) {
  try {
    const response = yield call(staredMail, mail)
    yield put(staredMailSuccess(response));
  } catch (error) {
    yield put(staredMailFail(error))
  }
}

function* mailsSaga() {
  yield takeEvery(GET_MAILS_LIST, fetchMailsLists),
    yield takeEvery(GET_MAILS_ID, fetchMailsListsId),
    yield takeEvery(SELECT_FOLDER, onSelectFolders),
    yield takeEvery(GET_SELECTED_MAILS, onGetSelectedMails),
    yield takeEvery(SET_FOLDER_SELECTED_MAILS, onSetFolderOnSelectedMails),
    yield takeEvery(UPDATE_MAIL, onUpdateMail),
    yield takeEvery(DELETE_MAIL, onDeleteMail),
    yield takeEvery(TRASH_MAIL, onTrashMail),
    yield takeEvery(STARED_MAIL, onStaredMail)
}

export default mailsSaga;