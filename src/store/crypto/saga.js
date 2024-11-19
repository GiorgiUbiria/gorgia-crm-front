import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_WALLET, GET_CRYPTO_ORDERS, GET_CRYPTO_PRODUCTS } from "./actionTypes";
import {
  getWalletSuccess,
  getWalletFail,
  getCryptoOrdersSuccess,
  getCryptoOrdersFail,
  getCryptoProductsSuccess,
  getCryptoProductsFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getWallet, getCryptoOrder, getCryptoProduct } from "helpers/fakebackend_helper";

function* fetchWallet() {
  try {
    const response = yield call(getWallet);
    yield put(getWalletSuccess(response));
  } catch (error) {
    yield put(getWalletFail(error));
  }
}

function* fetchCrypto() {
  try {
    const response = yield call(getCryptoOrder);
    yield put(getCryptoOrdersSuccess(response));
  } catch (error) {
    yield put(getCryptoOrdersFail(error));
  }
}

function* fetchProducts({ payload: types }) {
  try {
    const response = yield call(getCryptoProduct, types);
    yield put(getCryptoProductsSuccess(response));
  } catch (error) {
    yield put(getCryptoProductsFail(error));
  }
}

function* cryptoSaga() {
  yield takeEvery(GET_WALLET, fetchWallet);
  yield takeEvery(GET_CRYPTO_ORDERS, fetchCrypto);
  yield takeEvery(GET_CRYPTO_PRODUCTS, fetchProducts);
}

export default cryptoSaga;
