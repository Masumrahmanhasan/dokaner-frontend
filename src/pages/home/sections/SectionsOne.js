import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getSetting, loadAsset } from "../../../utils/Helpers";
import _ from "lodash";
import { loadSectionsProducts } from "../../../utils/Services";
import ProductSectionSkeleton from "../../../skeleton/productSkeleton/ProductSectionSkeleton";
import RecentItems from "../includes/Products/recentProduct/includes/RecentItems";
import { Link } from "react-router-dom";

const SectionsOne = (props) => {
  const { general } = props;

  const section_one_title = getSetting(general, "section_one_title");
  const section_one_title_image = getSetting(general, "section_one_title_image");
  const section_one_visible_title = getSetting(general, "section_one_visible_title");
  const query_url = getSetting(general, "section_one_query_url");
  const query_type = getSetting(general, "section_one_query_type");

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (_.isEmpty(products)) {
      loadSectionsProducts("section_one").then((response) => {
        if (!_.isEmpty(response)) {
          const products = JSON.parse(response.products);
          if (!_.isEmpty(products)) {
            const Content = products.Content;
            if (!_.isEmpty(Content)) {
              setProducts(Content);
            }
          }
        }
        setLoading(false);
      });
    }
  }, []);

  return (
    <div className='container deal-section'>
      <div className='row mt-1 mb-0 mb-md-1 mb-md-1  pb-md-1'>
        <div className='col-6'>
          <h3 className='title title-sm'>
            {" "}
            {section_one_visible_title === "image" ? (
              <img src={loadAsset(section_one_title_image)} alt='' />
            ) : (
              section_one_title || "..."
            )}
          </h3>
        </div>
        <div className='col-6 text-right'>
          {query_type === "search_query" ? (
            <Link to={`/search${query_url}`} className='btn btn-default px-4 py-2 py-md-3 rounded'>
              View All
            </Link>
          ) : (
            <Link to={`/shop${query_url}`} className='btn btn-default px-4 py-2 py-md-3 rounded'>
              View All
            </Link>
          )}
        </div>
      </div>

      {loading && <ProductSectionSkeleton />}
      {!loading && products.length > 0 && <RecentItems products={products} />}
    </div>
  );
};

SectionsOne.propTypes = {
  general: PropTypes.object.isRequired,
};

export default SectionsOne;
