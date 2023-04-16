import React from 'react';
import {Link} from "react-router-dom";

const SuccessMessege = () => {
  return (
      <div className="text-center order_complete">
        <img
            src="/assets/img/happy.png"
            className="mb-3 mx-auto"
            style={{width: "8rem"}}
            alt="success"/>
        <div className="heading_s1">
          <h3>Your order is completed!</h3>
        </div>
        <p>
          Thank you for your order! Your order is being processed and will be
          completed within 3-6 hours. You will receive an email confirmation when your
          order is completed.
        </p>
        <Link to="/" className="btn btn-default p-3 mr-3">
          Continue Shopping
        </Link>
        <Link to="/dashboard/orders" className="btn btn-default p-3">
          Goto My Orders
        </Link>
      </div>
  );
};

export default SuccessMessege;