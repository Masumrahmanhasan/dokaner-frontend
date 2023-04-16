import React, { useEffect, useState } from "react";
import BrowseCategories from "./includes/BrowseCategories";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { loadBanners } from "../../../../store/actions/InitAction";
import OwlCarousel from "react-owl-carousel";
import { getSetting, loadAsset, useWindowSize } from "../../../../utils/Helpers";
import BannerSkeleton from "../../../../skeleton/BannerSkeleton";
import { getDiscountProduct } from "../../../../utils/Services";
import _ from "lodash";
import LargeCardSkelton from "../../../../skeleton/productSkeleton/LargeCardSkelton";
import BannerRight from "./includes/BannerRight";
import IntroBanner from "./includes/IntroBanner";
import LazyImage from "../../../../components/common/LazyImage";

const Intro = (props) => {
  const { banners, general, auth } = props;
  const currency_icon = getSetting(general, "currency_icon");
  const [loading, setLoading] = useState(false);
  const [discountLoading, setDiscountLoading] = useState(true);
  const [products, setProducts] = useState([]);
  let [width] = useWindowSize();

  width = width ? width : window.innerWidth;

  useEffect(() => {
    if (!loading) {
      props.loadBanners();
    }
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [loading]);

  useEffect(() => {
    if (_.isEmpty(products)) {
      getDiscountProduct().then((response) => {
        if (!_.isEmpty(response)) {
          const products = response.SuperDealProducts;
          if (!_.isEmpty(products)) {
            setProducts(products);
          }
        }
        setDiscountLoading(false);
      });
    }
  }, []);

  // decide what is render for home page card
  let homePageContent = null;
  if (discountLoading) {
    homePageContent = <LargeCardSkelton />;
  }
  if (!discountLoading && products.length > 0) {
    homePageContent = (
      <OwlCarousel
        className='owl-carousel owl-theme owl-nav-inside row cols-3'
        loop={true}
        margin={10}
        dots={false}
        nav={false}
        autoplay={true}
        autoplayTimeout={3000}
        responsiveClass={true}
        responsive={{
          0: {
            items: 1,
            loop: false,
          },
          600: {
            items: 4,
          },
          1000: {
            items: 4,
            loop: true,
          },
        }}
      >
        {products.map((product, index) => {
          const product_code = product.product_code ? product.product_code : product.ItemId;
          return (
            <div key={index}>
              <Link className='homeComp' to={`/product/${product_code}`}>
                <LazyImage classes='' imageSrc={product.img} imageAlt='' />
                {/* <img className='' src={product.img} alt='' /> */}
                <button className='homeLogin-btn'>
                  {" "}
                  {`${currency_icon}`} {` `}
                  {_.round(product.discount_price)}
                </button>
                <h6 className='dOprice'>
                  {`${currency_icon}`} {` `}
                  {_.round(product.original_price)}
                </h6>
              </Link>
            </div>
          );
        })}
      </OwlCarousel>
    );
  }

  return (
    <div className='intro-section'>
      <div className='container mt-0 mt-md-1'>
        <div className='row'>
          <div className='col-lg-3 cols d-none d-lg-block mb-1 pr-0 '>
            <BrowseCategories />
          </div>
          <div className='col-lg-6 cols col-md-12 col-12 mb-1 pr-0'>
            <div className='h-100 intro-center'>
              {width >= 768 ? (
                <div className='intro-slider-container br-8'>
                  {banners.banners && !loading ? (
                    <IntroBanner banners={banners.banners} width={width} />
                  ) : (
                    <BannerSkeleton />
                  )}
                </div>
              ) : (
                <div className='intro-slider-container br-8'>
                  {banners.banners && !loading ? (
                    <IntroBanner banners={banners.banners} width={width} />
                  ) : (
                    <BannerSkeleton />
                  )}
                  {/* {banners.mobileBanners && !loading ? (
                    <IntroBanner banners={banners.mobileBanners} width={width} />
                  ) : (
                    <BannerSkeleton />
                  )} */}
                </div>
              )}
              <div className='banner-bottom-part br-8'>
                <div
                  className='row'
                  style={{
                    alignItems: "center",
                  }}
                >
                  <div className='col-12'>
                    <div className='h-100'>
                      <div className='row align-items-center'>
                        <div className='col-md-3 fCenter'>
                          <div className=''>
                            <h3 className='bold fs-18'>Your fave shopping guide</h3>
                            <p className='bold' style={{ lineHeight: "normal", fontSize: "12px" }}>
                              Checkout the latest new Deals
                            </p>
                          </div>
                        </div>
                        <div className='col-md-9'>
                          <div className=''>{homePageContent}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-lg-3 cols d-none d-lg-block mb-1 pr-0 '>
            <BannerRight general={general} auth={auth} />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  banners: state.INIT.banners,
  auth: state.AUTH,
  categories: state.INIT.categories,
  category_loading: state.LOADING.category_loading,
});

export default connect(mapStateToProps, { loadBanners })(withRouter(Intro));
