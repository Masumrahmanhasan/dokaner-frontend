import React from 'react';
import {Link} from "react-router-dom";

const ErrorMessege = (props) => {

  return (
      <div className="text-center order_complete">
        <img
            src="/assets/img/sad.png"
            className="mb-3 mx-auto"
            style={{width: "8rem"}}
            alt="error"/>
        <div className="heading_s1">
          <h3>Your Transaction Failed!</h3>
        </div>
        <p>
          Thank you for your order! Your order is being processed and will be
          completed within 3-6 hours. You will receive an email confirmation when your
          order is completed.
        </p>
        <Link to={`/dashboard/order/${props.tran_id}`} className="btn btn-default p-3 mr-3">
          Payment Again
        </Link>
        <Link to="/dashboard/orders" className="btn btn-default p-3">
          Goto My Orders
        </Link>
      </div>
  );
};

export default ErrorMessege;