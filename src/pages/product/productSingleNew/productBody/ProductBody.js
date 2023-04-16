import React, { useState } from "react";
import LoadAttributes from "./includes/LoadAttributes";
import ProductSummary from "./includes/ProductSummary";
import MediaPart from "./includes/MediaPart";
import { AiOutlineShopping } from "react-icons/ai";
import { BsCart3, BsFillCartDashFill, BsHeart } from "react-icons/bs";
import {
  ConfiguratorAttributes,
  findFirstConfigurators,
  findProductCartFromState,
  getColorAttributes,
  updateAddStoredCart,
} from "../../../../utils/CartHelpers";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";
import { withRouter, Link, useHistory } from "react-router-dom";
import ProductConfiguredItems from "./ProductConfiguredItems";
import swal from "sweetalert";
import { productAddToWishlist } from "../../../../store/actions/AuthAction";
import SingleAttributeGroup from "./includes/SingleAttributeGroup";
import AppOffer from "./includes/AppOffer";
import { FaRegCopy } from "react-icons/fa";
import PriceRange from "./includes/PriceRange";

import CopyToClipboard from "react-copy-to-clipboard";
import { configAttrToConfigured, removeProductIntoVirtualCart } from "../../../../utils/GlobalStateControl";
import AddProductModal from "./includes/AddProductModal";
import { getSetting } from "../../../../utils/Helpers";
import AirFilter from "./includes/AirFilter";
import shop from "../../../../assets/images/shop.png";
import wishlist from "../../../../assets/images/love.png";
import { EmailShareButton, FacebookShareButton, WhatsappShareButton } from "react-share";

const ProductBody = (props) => {
  const { product, general, cartConfigured, ConfiguredItems, auth } = props;

  const history = useHistory();
  const product_id = !_.isEmpty(product) ? product.Id : 0;
  const firstConfigurators = findFirstConfigurators(ConfiguredItems);
  const ConfigAttributes = ConfiguratorAttributes(product);
  const colorAttributes = getColorAttributes(ConfigAttributes);
  const copyText = window.location.href;
  let activeProduct = findProductCartFromState(cartConfigured, product_id);
  const totalQty = activeProduct.totalQty;
  const [activeImg, setActiveImg] = useState("");
  const [copy, setCopy] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const bulkPriceQuantity = product.BulkPrices;

  const localCart = JSON.parse(window.localStorage.getItem("_configured")) || [];

  const reExistCart = localCart.filter((filterItem) => filterItem.Id != product_id);

  const minOrderPrice = getSetting(general, "min_order_amount");
  const minOrderQuantity = getSetting(general, "min_order_quantity");

  // let minQ = activeProduct?.bulkPriceQuantity[0]?.MinQuantity;

  const alertForQuantity = (e) => {
    e.preventDefault();
    swal({
      text: "Add your quantity first!",
      icon: "warning",
      buttons: "Ok, Understood",
    });
  };

  const addToWishlist = (e, product) => {
    e.preventDefault();
    props.productAddToWishlist(product, auth.shopAsCustomer.id, auth.isShopAsCustomer);
  };

  const onCopy = () => {
    setCopy(true);
  };

  const addToCart = (e) => {
    e.preventDefault();

    if (activeProduct.totalPrice >= 5000) {
      updateAddStoredCart([...reExistCart, ...cartConfigured], auth.shopAsCustomer.id, auth.isShopAsCustomer);
      configAttrToConfigured([...reExistCart, ...cartConfigured]);
      removeProductIntoVirtualCart();
      setAddSuccess(true);
    } else if (activeProduct.totalPrice < minOrderPrice || activeProduct.totalQty < minOrderQuantity) {
      swal({
        text: `Dear customer, this product should be ordered for a minimum of ${minOrderQuantity} pieces and ${minOrderPrice} taka ${`\n \n`} (সম্মানিত গ্রাহক এই পণ্যটি সর্বনিম্ন ${minOrderQuantity} পিস এবং ${minOrderPrice} টাকার অর্ডার করতে হবে। )`,
        icon: "warning",
        buttons: "Ok, Understood",
      });
      return;
    } else {
      updateAddStoredCart([...reExistCart, ...cartConfigured], auth.shopAsCustomer.id, auth.isShopAsCustomer);
      configAttrToConfigured([...reExistCart, ...cartConfigured]);
      removeProductIntoVirtualCart();
      setAddSuccess(true);
    }
  };
  const buyNow = (e) => {
    e.preventDefault();

    if (activeProduct.totalPrice >= 5000) {
      updateAddStoredCart([...reExistCart, ...cartConfigured], auth.shopAsCustomer.id, auth.isShopAsCustomer);
      configAttrToConfigured([...reExistCart, ...cartConfigured]);
      removeProductIntoVirtualCart();
      history.push("/checkout");
    } else if (activeProduct.totalPrice < minOrderPrice || activeProduct.totalQty < minOrderQuantity) {
      swal({
        text: `Dear customer, this product should be ordered for a minimum of ${minOrderQuantity} pieces and ${minOrderPrice} taka ${`\n \n`} (সম্মানিত গ্রাহক এই পণ্যটি সর্বনিম্ন ${minOrderQuantity} পিস এবং ${minOrderPrice} টাকার অর্ডার করতে হবে। )`,
        icon: "warning",
        buttons: "Ok, Understood",
      });
      return;
    } else {
      updateAddStoredCart([...reExistCart, ...cartConfigured], auth.shopAsCustomer.id, auth.isShopAsCustomer);
      configAttrToConfigured([...reExistCart, ...cartConfigured]);
      removeProductIntoVirtualCart();
      history.push("/checkout");
    }
  };

  // const updateAddStoredCart = (cart, useCase) => {
  //   updateStoredCart(cart)
  //     .then((response) => {
  //       if (!_.isEmpty(response)) {
  //         const resData = response.data;
  //         console.log("resData", resData);
  //         if (!_.isEmpty(resData)) {
  //           const cart = resData.cart;
  //           if (!_.isEmpty(cart)) {
  //             configAttrToConfigured([...reExistCart, ...cartConfigured]);
  //             removeProductIntoVirtualCart();
  //             if (useCase === "buy") {
  //               history.push("/checkout");
  //             } else if (useCase === "add") {
  //               setAddSuccess(true);
  //             }
  //           }
  //         }
  //       }
  //     })
  //     .catch((error) => console.log(error));
  // };

  return (
    <>
      <div className='product-details-top'>
        <h1
          className='product-title'
          style={{
            lineHeight: "1.4",
            fontSize: "1.5rem",
            textOverflow: "unset",
            overflow: "unset",
            whiteSpace: "break-spaces",
          }}
        >
          {product.Title && product.Title}
        </h1>

        <div className='row'>
          <div className='col-md-6'>
            <MediaPart activeImg={activeImg} setActiveImg={setActiveImg} product={product} />
          </div>
          {/* End .col-md-6 */}
          <div className='col-md-6'>
            <div className='product-details' id='hello'>
              <AppOffer />
              {bulkPriceQuantity.length > 1 && (
                <PriceRange
                  product={product}
                  general={general}
                  totalQty={totalQty}
                  bulkPriceQuantity={bulkPriceQuantity}
                />
              )}

              {_.isArray(firstConfigurators) &&
                firstConfigurators.map((singleConfig, index) => (
                  <SingleAttributeGroup
                    key={index}
                    singleConfig={singleConfig}
                    ConfigAttributes={ConfigAttributes}
                  />
                ))}
              <LoadAttributes
                setActiveImg={setActiveImg}
                product={product}
                general={general}
                colorAttributes={colorAttributes}
                ConfiguredItems={ConfiguredItems}
              />

              <ProductConfiguredItems
                product={product}
                general={general}
                colorAttributes={colorAttributes}
                ConfiguredItems={ConfiguredItems}
                totalQtyInCart={totalQty}
                bulkPriceQuantity={bulkPriceQuantity}
              />

              <div className='details-filter-row'>
                <ProductSummary product={product} general={general} />
              </div>

              <AirFilter />

              {/* End .details-filter-row */}

              <div className='d-none d-md-block'>
                <div className='row'>
                  <div className='col-md-3 pd-btn'>
                    <a href={"/add-to-wishlist"} onClick={(e) => addToWishlist(e, product)}>
                      <div
                        className='imageBt bt ripple disabled mobilefont'
                        style={{
                          width: "auto",
                          height: "auto",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "auto",
                        }}
                      >
                        <BsHeart style={{ fontSize: "16px" }} />
                        <span className='ml01'>Save</span>
                      </div>
                    </a>
                  </div>

                  {Number(activeProduct.totalQty) > 0 ? (
                    <div className='col-md-5 pd-btn'>
                      <a href={"/add-to-wishlist"} onClick={(e) => addToCart(e)}>
                        <div
                          className='imageBt bt ripple disabled mobilefont'
                          style={{
                            width: "auto",
                            height: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "auto",
                          }}
                        >
                          <BsFillCartDashFill style={{ fontSize: "16px" }} />
                          <span className='ml01'>Add to cart</span>
                        </div>
                      </a>
                    </div>
                  ) : (
                    <div className='col-md-5 pd-btn'>
                      <a href={"/buy-now"} onClick={(e) => alertForQuantity(e)}>
                        <div
                          className='imageBt bt ripple disabled mobilefont'
                          style={{
                            width: "auto",
                            height: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "auto",
                          }}
                        >
                          <BsFillCartDashFill style={{ fontSize: "16px" }} />
                          <span className='ml01'>Add to cart</span>
                        </div>
                      </a>
                    </div>
                  )}

                  {Number(activeProduct.totalQty) > 0 ? (
                    <div className='col-md-4 pd-btn'>
                      <a href={"/buy-now"} onClick={(e) => buyNow(e)}>
                        <div
                          className='imageBt bt ripple disabled mobilefont'
                          style={{
                            height: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "auto",
                          }}
                        >
                          <BsCart3 style={{ fontSize: "16px" }} />
                          <span className='ml01'>Buy Now</span>
                        </div>
                      </a>
                    </div>
                  ) : (
                    <div className='col-md-4 pd-btn'>
                      <a href={"/buy-now"} onClick={(e) => alertForQuantity(e)}>
                        <div
                          className='imageBt bt ripple disabled mobilefont'
                          style={{
                            height: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "auto",
                          }}
                        >
                          <BsCart3 style={{ fontSize: "16px" }} />
                          <span className='ml01'>Buy Now</span>
                        </div>
                      </a>
                    </div>
                  )}
                </div>

                {/* <a
                href={"/add-to-wishlist"}
                onClick={(e) => addToWishlist(e, product)}
                className='btn-product btn-wishlist'
              >
                <span>Save</span>
              </a>

              <a
                href={"/buy-now"}
                onClick={(e) => addToCart(e)}
                className='btn-product btn-cart'
                style={{ marginLeft: "10px" }}
              >
                <span>Buy Now</span>
              </a> */}

                {/* {Number(activeProduct.totalQty) > 0 ? (
                <Link
                  to='/checkout'
                  className='btn-product btn-cart'
                  style={{ background: "#9b9b9b", marginLeft: "10px" }}
                >
                  <span>Buy Now</span>
                </Link>
              ) : (
                <a
                  href={"/buy-now"}
                  onClick={(e) => alertForQuantity(e)}
                  className='btn-product btn-cart'
                  style={{ marginLeft: "10px" }}
                >
                  <span>Buy Now</span>
                </a>
              )} */}
              </div>

              {/* End .product-details-action */}

              {/* group data */}
              <div className='groupData'>
                <div>
                  <b>Product Code: </b>
                  <span>{product_id}</span>
                </div>

                <div class='row d-none d-md-block' style={{ marginTop: "20px", flexWrap: "wrap" }}>
                  <div className='col-md-6'>
                    <Link to={`/seller/${product.VendorId}?page=1`}>
                      <div
                        className='imageBt bt ripple disabled mobilefont'
                        style={{
                          width: "auto",
                          height: "auto",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "auto",
                        }}
                      >
                        <AiOutlineShopping style={{ fontSize: "16px" }} />
                        <span className='ml01'>Visit Seller Store</span>
                      </div>
                    </Link>
                  </div>
                  {/* <div style={{ marginLeft: "0.75rem", marginRight: "0.75rem" }}>
                  <Link to='/'>
                    <div
                      className='imageBt bt ripple disabled mobilefont'
                      style={{
                        width: "auto",
                        height: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "auto",
                      }}
                    >
                      <RiGroupLine style={{ fontSize: "16px" }} />
                      <span className='ml01'>View Sellers</span>
                    </div>
                  </Link>
                </div>
                <div>
                  <Link to='/'>
                    <div
                      className='imageBt bt ripple disabled mobilefont'
                      style={{
                        width: "auto",
                        height: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "auto",
                      }}
                    >
                      <BsImage style={{ fontSize: "16px" }} />
                      <span className='ml01'>Image Search</span>
                    </div>
                  </Link>
                </div> */}
                </div>
              </div>

              <div className='product-details-footer'>
                <div className='social-icons social-icons-sm'>
                  <span className='social-label'>Share:</span>
                  <FacebookShareButton url={`${copyText}`} className='mx-2'>
                    <a className='social-icon' title='Facebook'>
                      <i className='icon-facebook-f' />
                    </a>
                  </FacebookShareButton>

                  {/* <FacebookMessengerShareButton url={`${copyText}`} className='mx-1 mx-md-2'>
                    <a className='social-icon' title='Messenger'>
                      <i className='icon-facebook-messenger' />
                    </a>
                  </FacebookMessengerShareButton> */}

                  <WhatsappShareButton url={`${copyText}`} className='mx-2'>
                    <a className='social-icon' title='Whatsapp'>
                      <i className='icon-whatsapp' />
                    </a>
                  </WhatsappShareButton>

                  <EmailShareButton url={`${copyText}`} className='mx-2'>
                    {" "}
                    <a className='social-icon' title='Email'>
                      <i className='icon-envelope' />
                    </a>
                  </EmailShareButton>

                  <div>
                    <CopyToClipboard onCopy={onCopy} text={copyText}>
                      <button
                        class='bt copyLink'
                        style={{
                          borderRadius: "64px",
                          width: "80px",
                          height: "31px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <FaRegCopy />
                        <span style={{ fontSize: "14px", marginLeft: "0.5rem" }}>
                          {copy ? "Copied " : "Copy"}
                        </span>
                      </button>
                    </CopyToClipboard>
                  </div>
                </div>
              </div>

              {/* mobile floating button start */}
              <div className='sm-productAction d-block d-md-none'>
                <div className='row'>
                  <div className='col-3'>
                    <div className='flexBetween'>
                      <div className='flexCenter'>
                        <Link title='Shop' className='flxColCenter' to={`/seller/${product.VendorId}?page=1`}>
                          {" "}
                          <img style={{ width: "16px" }} src={shop} alt='' />
                          <span className='text-center' style={{ fontSize: "10px", color: "#000" }}>
                            Shop
                          </span>
                        </Link>
                      </div>
                      <div className='flexCenter'>
                        <Link
                          title='Shop'
                          className='flxColCenter'
                          onClick={(e) => addToWishlist(e, product)}
                        >
                          {" "}
                          <img style={{ width: "16px" }} src={wishlist} alt='' />
                          <span className='text-center' style={{ fontSize: "10px", color: "#000" }}>
                            Save
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className='col-9' style={{ paddingLeft: "0" }}>
                    <div className='flex'>
                      {Number(activeProduct.totalQty) > 0 ? (
                        <div className='btn sm-add' onClick={(e) => addToCart(e)}>
                          {" "}
                          <i className='icon-cart-plus mr-1'></i> Add to cart
                        </div>
                      ) : (
                        <div className='btn sm-add' onClick={(e) => alertForQuantity(e)}>
                          {" "}
                          <i className='icon-cart-plus mr-1'></i> Add to cart
                        </div>
                      )}
                      {Number(activeProduct.totalQty) > 0 ? (
                        <div className='btn sm-buy' onClick={(e) => buyNow(e)}>
                          {" "}
                          <i className='icon-shopping-cart mr-1'></i> Buy now
                        </div>
                      ) : (
                        <div className='btn sm-buy' onClick={(e) => alertForQuantity(e)}>
                          {" "}
                          <i className='icon-shopping-cart mr-1'></i> Buy now
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* mobile floating button end */}

              {/* End .product-details-footer */}
            </div>
            {/* End .product-details */}
          </div>
          {/* End .col-md-6 */}
        </div>
        {/* End .row */}
      </div>
      {addSuccess && <AddProductModal addSuccess={addSuccess} setAddSuccess={setAddSuccess} />}
    </>
  );
};

ProductBody.propTypes = {
  product: PropTypes.object.isRequired,
  general: PropTypes.object.isRequired,
  ConfiguredItems: PropTypes.array.isRequired,
  cartConfigured: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  cartConfigured: state.CART.virtualCart,
  existCart: state.CART.configured,
  auth: state.AUTH,
});

export default connect(mapStateToProps, { productAddToWishlist })(withRouter(ProductBody));
