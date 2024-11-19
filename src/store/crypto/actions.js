import {
  GET_WALLET,
  GET_WALLET_FAIL,
  GET_WALLET_SUCCESS,
  GET_CRYPTO_ORDERS,
  GET_CRYPTO_ORDERS_FAIL,
  GET_CRYPTO_ORDERS_SUCCESS,
  GET_CRYPTO_PRODUCTS,
  GET_CRYPTO_PRODUCTS_FAIL,
  GET_CRYPTO_PRODUCTS_SUCCESS,
} from "./actionTypes"

export const getWallet = () => ({
  type: GET_WALLET,
})

export const getWalletSuccess = wallets => ({
  type: GET_WALLET_SUCCESS,
  payload: wallets,
})

export const getWalletFail = error => ({
  type: GET_WALLET_FAIL,
  payload: error,
})

export const getCryptoOrders = () => ({
  type: GET_CRYPTO_ORDERS,
})

export const getCryptoOrdersSuccess = orders => ({
  type: GET_CRYPTO_ORDERS_SUCCESS,
  payload: orders,
})

export const getCryptoOrdersFail = error => ({
  type: GET_CRYPTO_ORDERS_FAIL,
  payload: error,
})

export const getCryptoProducts = (types) => ({
  type: GET_CRYPTO_PRODUCTS,
  payload: types
})

export const getCryptoProductsSuccess = products => ({
  type : GET_CRYPTO_PRODUCTS_SUCCESS,
  payload : products,
})

export const getCryptoProductsFail = error => ({
  type : GET_CRYPTO_PRODUCTS_FAIL,
  payload : error
})