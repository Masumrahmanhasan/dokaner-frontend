import React from 'react';
import ProductCartSkeleton from "./ProductCartSkeleton";

const ProductSectionSkeleton = () => {
  return (
      <div className="row">
        {[...Array(4)].map((x, index) => (
            <ProductCartSkeleton key={index}/>
        ))}
      </div>
  );
};

export default ProductSectionSkeleton;