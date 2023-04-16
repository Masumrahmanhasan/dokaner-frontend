import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import { getSetting } from "../../../../../utils/Helpers";
import { findProductCartFromState, numberWithCommas } from "../../../../../utils/CartHelpers";

const ProductSummary = (props) => {
  const { product, general, cartConfigured } = props;
  const product_id = !_.isEmpty(product) ? product.Id : "";
  const activeCartProduct = findProductCartFromState(cartConfigured, product_id);

  const currency = getSetting(general, "currency_icon");
  const china_to_bd_bottom_message = getSetting(general, "china_to_bd_bottom_message");
  const chinaLocalShippingCharges = getSetting(general, "china_local_delivery_charge");
  const chinaLocalShippingChargeLimit = getSetting(general, "china_local_delivery_charge_limit");
  const totalWeight = activeCartProduct.totalWeight;
  const approxWeight = activeCartProduct.ApproxWeight;
  const totalPrice = activeCartProduct.totalPrice;
  const totalQty = activeCartProduct.totalQty;
  const DeliveryCost = activeCartProduct.DeliveryCost;
  const ShippingRate = activeCartProduct.ShippingRate;

  const getChinaLocalShippingCost = (
    totalPrice,
    chinaLocalShippingCharges,
    chinaLocalShippingChargeLimit
  ) => {
    let localShippingCost = chinaLocalShippingCharges;

    localShippingCost = Number(totalPrice) >= chinaLocalShippingChargeLimit ? 0 : localShippingCost;

    return Number(localShippingCost);
  };

  const productTotalCost = () => {
    return (
      Number(totalPrice) +
      getChinaLocalShippingCost(totalPrice, chinaLocalShippingCharges, chinaLocalShippingChargeLimit)
    );
  };

  return (
    <table className='table table-sm table-bordered product_summary_table'>
      <tbody>
        <tr>
          <td className='bg-gray text-center  '>
            {" "}
            <strong>FROM CHINA </strong>
            <img className='country-im' src='https://wholesalecart.com/static/media/cn.10077f3e.svg' alt='' />
          </td>
          <td className='bg-gray text-center '>
            <strong> TO BANGLADESH</strong>
            <img className='country-im' src='https://wholesalecart.com/static/media/bd.7b147c00.svg' alt='' />
          </td>
        </tr>
        <tr>
          <td>Total Quantity:</td>
          <td>{`${totalQty || 0}`}</td>
        </tr>
        <tr>
          <td>Product Price:</td>
          <td>{`${currency} ${numberWithCommas(totalPrice)}`}</td>
        </tr>
        <tr>
          <td>Approx. Weight:</td>
          <td>{totalWeight || "0.000"} kg ( আনুমানিক)</td>
        </tr>
        <tr>
          <td>China Local Shipping charge:</td>
          <td>{`${currency} ${numberWithCommas(
            getChinaLocalShippingCost(totalPrice, chinaLocalShippingCharges, chinaLocalShippingChargeLimit)
          )}`}</td>
        </tr>
        {/* <tr>
          <td>Shipping charge:</td>
          <td>{`${currency} ${numberWithCommas(ShippingRate)}`} Per Kg</td>
        </tr> */}
        <tr>
          <td>Total Products Price:</td>
          <td>{`${currency} ${numberWithCommas(productTotalCost())}`}</td>
        </tr>
        <tr>
          <td colSpan={2}>{china_to_bd_bottom_message}</td>
        </tr>
        <tr>
          <td colSpan={2}>
            <span>
              ** উপরে উল্লেখিত পণ্যের ওজন সম্পূর্ণ সঠিক নয়, আনুমানিক মাত্র। বাংলাদেশে আসার পর পণ্যটির প্রকৃত
              ওজন মেপে শিপিং চার্জ হিসাব করা হবে।
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

ProductSummary.propTypes = {
  general: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  cartConfigured: state.CART.virtualCart,
});

export default connect(mapStateToProps, {})(withRouter(ProductSummary));
