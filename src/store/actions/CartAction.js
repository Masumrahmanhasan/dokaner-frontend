import _ from "lodash";
import * as Types from "./types";
import { CheckAndSetErrors, configAttrToConfigured, setGlobalErrors } from "../../utils/GlobalStateControl";
import { in_loading, out_loading, place_loading } from "../../utils/LoadingState";
import { axiosInstance } from "../../utils/AxiosDefault";
import { destroyLocalCart, storelocalCart } from "../../utils/CartHelpers";

export const loadCart = (id, shopAsCustomer) => (dispatch) => {
  in_loading();
  axiosInstance
    .get("/cart/get", {
      params: {
        id: id,
        shopAsCustomer: shopAsCustomer,
      },
    })
    .then((response) => {
      const responseData = response.data;

      const noError = CheckAndSetErrors(responseData);
      if (noError) {
        if (!_.isEmpty(responseData)) {
          const cart = responseData.data.cart;
          if (!_.isEmpty(cart)) {
            const configured = JSON.parse(cart);

            dispatch({
              type: Types.SELECT_CONFIGURED,
              payload: {
                configured: configured,
              },
            });
            storelocalCart(configured);
          }
        }
      }
    })
    .catch((error) => {
      dispatch({
        type: Types.SELECT_CONFIGURED,
        payload: {
          configured: [],
        },
      });
      storelocalCart([]);
    })
    .then(() => {
      out_loading();
    });
};
export const loadCustomerCart = (id, shopAsCustomer) => (dispatch) => {
  in_loading();
  axiosInstance
    .get("/cart/get", {
      params: {
        id: id,
        shopAsCustomer: shopAsCustomer,
      },
    })
    .then((response) => {
      const responseData = response.data;

      const noError = CheckAndSetErrors(responseData);
      if (noError) {
        if (!_.isEmpty(responseData)) {
          const cart = responseData.data.cart;
          if (!_.isEmpty(cart)) {
            const configured = JSON.parse(cart);
            dispatch({
              type: Types.SELECT_CONFIGURED,
              payload: {
                configured: configured,
              },
            });
            storelocalCart(configured);
          }
        }
      }
    })
    .catch((error) => {
      dispatch({
        type: Types.SELECT_CONFIGURED,
        payload: {
          configured: [],
        },
      });
      storelocalCart([]);
    })
    .then(() => {
      out_loading();
    });
};
export const addToOriginalCart = async (cart) => (dispatch) => {
  axiosInstance
    .put("/cart/update", {
      params: {
        cart: cart,
      },
    })
    .then((response) => {
      const responseData = response.data;

      // const noError = CheckAndSetErrors(responseData);
      // if (noError) {
      //   if (!_.isEmpty(responseData)) {
      //     const configured = responseData.configured;
      //     dispatch({
      //       type: Types.SELECT_CONFIGURED,
      //       payload: {
      //         configured: JSON.parse(configured),
      //       },
      //     });
      //     storelocalCart(configured);
      //   }
      // }
    })
    .catch((error) => {
      // setGlobalErrors(error.response);
    });
};

export const confirmCustomerOrder = (history, orderData) => (dispatch) => {
  place_loading(true);
  axiosInstance
    .post("/confirm-order", orderData)
    .then((response) => {
      const responseData = response.data;
      const noError = CheckAndSetErrors(responseData);
      if (noError) {
        const getData = responseData.data;
        if (!_.isEmpty(getData)) {
          const redirect = getData.redirect;
          if (redirect) {
            destroyLocalCart();
            configAttrToConfigured([]);
            // window.location.assign(redirect);
            history.push(redirect);
          }
          if (getData.safsdfsadf !== undefined) {
            dispatch({
              type: Types.LOAD_FAKE,
              payload: {
                fake: {},
              },
            });
          }
        }
      }
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    })
    .then(() => {
      place_loading(false);
    });
};

export const changesPaymentsStatusToConfirm = (orderData) => (dispatch) => {
  in_loading();
  axiosInstance
    .post("/payment-confirm", orderData)
    .then((response) => {
      const responseData = response.data;
      const noError = CheckAndSetErrors(responseData);
      if (noError) {
        const getData = responseData.data;
        if (!_.isEmpty(getData)) {
          const redirect = getData.redirect;
          if (redirect) {
            window.location.assign(redirect);
          }
          if (getData.safsdfsadf !== undefined) {
            dispatch({
              type: Types.LOAD_FAKE,
              payload: {
                fake: {},
              },
            });
          }
        }
      }
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    })
    .then(() => {
      out_loading();
    });
};
