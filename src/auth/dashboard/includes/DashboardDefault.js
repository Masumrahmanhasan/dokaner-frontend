import React, { useEffect, useState } from "react";
import { getAllInvoices, getAlOrderItems, getCustomerAllOrders } from "../../../utils/Services";
import conplteOreder from "../../../assets/images/cd/completed-order.png";
import processing from "../../../assets/images/cd/process.png";
import ready from "../../../assets/images/cd/processing .png";
import invoiceImg from "../../../assets/images/cd/invoice.png";
import pending from "../../../assets/images/cd/pending.png";
import refunded from "../../../assets/images/cd/refund.png";
import allOrder from "../../../assets/images/cd/allOrder.png";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Loading from "../../../components/common/Loading";

const CardDetails = ({ loading, data, src, title }) => {
  return (
    <>
      <div className='flexCenter mb-1 mb-md-2'>
        <img className='cd-img' src={src} alt='' />
      </div>
      <h3 className='d-title'>{title}</h3>
      {loading && !data.length && <Loading />}
      {!loading && data.length ? <h1 className='mb-0 d-title'>{data.length}</h1> : null}
      {!loading && !data.length && <h1 className='mb-0 d-title'>0</h1>}
    </>
  );
};

const DashboardDefault = (props) => {
  const { auth } = props;
  const [allOrdersLoading, setAllOrdersLoading] = useState(false);
  const [orderItemsLoading, setOrderItemsLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    setAllOrdersLoading(true);
    getCustomerAllOrders(auth.shopAsCustomer.id, auth.isShopAsCustomer).then((response) => {
      setAllOrdersLoading(false);
      setOrders(response.orders);
    });
  }, [auth.shopAsCustomer.id, auth.isShopAsCustomer]);

  useEffect(() => {
    setOrderItemsLoading(true);
    getAlOrderItems(auth.shopAsCustomer.id, auth.isShopAsCustomer).then((response) => {
      setOrderItemsLoading(false);
      setOrderItems(response.data.items);
    });
  }, [auth.shopAsCustomer.id, auth.isShopAsCustomer]);

  useEffect(() => {
    setInvoiceLoading(true);
    getAllInvoices(auth.shopAsCustomer.id, auth.isShopAsCustomer).then((response) => {
      setInvoiceLoading(false);
      setInvoices(response.data.invoices);
    });
  }, [auth.shopAsCustomer.id, auth.isShopAsCustomer]);

  const pendingOrders = orders.filter((order) => order.status === "waiting-for-payment");
  const processingOrders = orderItems.filter(
    (order) =>
      order.status !== "ready-to-deliver" && order.status !== "refunded" && order.status !== "delivered"
  );
  const completeOrders = orderItems.filter((order) => order.status === "delivered");
  const readyForDelivery = orderItems.filter((order) => order.status === "ready-to-deliver");
  const refundedOrders = orderItems.filter((order) => order.status === "refunded");

  return (
    <div className='card'>
      <div className='card-header py-2 px-1 px-md-2'>
        <h4 className='card-title'>Dashboard</h4>
      </div>
      <div className='card-body p-2 p-md-4'>
        <div className='status-box'>
          <div className='my-1 my-md-0 '>
            <div className=' h-100 card-body p-1 p-md-2 p-lg-3 shadow text-center border flexCenter flex-column'>
              <div>
                <Link to={`/dashboard/orders`}>
                  <CardDetails
                    title='Total Orders'
                    loading={orderItemsLoading}
                    data={orderItems}
                    src={allOrder}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className='my-1 my-md-0 '>
            <div className=' h-100 card-body p-1 p-md-2 p-lg-3 shadow text-center border flexCenter flex-column'>
              <div>
                <Link to={`/dashboard/pending-orders`}>
                  <CardDetails
                    title='Pending Orders'
                    loading={orderItemsLoading}
                    data={pendingOrders}
                    src={pending}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className='my-1 my-md-0 '>
            <div className=' h-100 card-body p-1 p-md-2 p-lg-3 shadow text-center border flexCenter flex-column'>
              <div>
                <Link to={`/dashboard/processing-orders`}>
                  <CardDetails
                    title='Processing Orders'
                    loading={orderItemsLoading}
                    data={processingOrders}
                    src={processing}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className='my-1 my-md-0'>
            <div className=' h-100 card-body p-1 p-md-2 p-lg-3 shadow text-center border flexCenter flex-column'>
              <div>
                <Link to={`/dashboard/ready-to-delivered`}>
                  <CardDetails
                    title='Ready to deliver'
                    loading={orderItemsLoading}
                    data={readyForDelivery}
                    src={ready}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className='my-1 my-md-0'>
            <div className=' h-100 card-body p-1 p-md-2 p-lg-3 shadow text-center border flexCenter flex-column'>
              <div>
                <Link to={`/dashboard/invoices`}>
                  <CardDetails title='Invoice' loading={invoiceLoading} data={invoices} src={invoiceImg} />
                </Link>
              </div>
            </div>
          </div>
          <div className='my-1 my-md-0'>
            <div className=' h-100 card-body p-1 p-md-2 p-lg-3 shadow text-center border flexCenter flex-column'>
              <div>
                <Link to={`/dashboard/complete-orders`}>
                  <CardDetails
                    title='Delivered Doorstep'
                    loading={orderItemsLoading}
                    data={completeOrders}
                    src={conplteOreder}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className=' my-1 my-md-0'>
            <div className=' h-100 card-body p-1 p-md-2 p-lg-3 shadow text-center border flexCenter flex-column'>
              <div>
                <Link to={`/dashboard/refunded-orders`}>
                  <CardDetails
                    title='Refunded Orders'
                    loading={orderItemsLoading}
                    data={refundedOrders}
                    src={refunded}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className='card-body mb-4 p-5 shadow'>
          <h2 className='d-title'>Notifications</h2>
          <ul className='list-group'>
            <li className='list-group-item'>No Notifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.AUTH,
});

export default connect(mapStateToProps, {})(withRouter(DashboardDefault));
