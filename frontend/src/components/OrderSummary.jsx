import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { MoveRight, Loader } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import axios from "../lib/axios";

function OrderSummary() {
  const { total, subTotal, coupon, isCouponApplied, cart, clearCart } =
    useCartStore();

  const savings = subTotal - total;

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/payments/create-order", {
        products: cart,
        couponCode: `${coupon?.code}`,
        isCouponApplied,
      });

      const order = data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "DevloperMM",
        description: "These are dummy payments for real feel",
        theme: { color: "#3399cc" },
        handler: async (payment) => {
          try {
            await axios.post("/payments/verify-order", {
              orderId: `${order.id}`,
              payId: `${payment.razorpay_payment_id}`,
              signature: `${payment.razorpay_signature}`,
              metadata: order.metadata,
            });

            clearCart();
            navigate("/purchase-success", {
              state: { orderID: order.id, payID: payment.razorpay_payment_id },
            });
          } catch (err) {
            console.error("Payment verifying error: ", err);
            navigate("/purchase-failure");
          }
        },
        modal: {
          ondismiss: () => {
            navigate("/purchase-failure");
          },
        },
      };

      setLoading(false);
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      navigate("/purchase-failure");
      console.error("Payment handling error: ", err);
    }
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 my-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Original price
            </dt>
            <dd className="text-base font-medium text-white">
              ₹{subTotal.toFixed(2)}
            </dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">
                -₹{savings.toFixed(2)}
              </dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-emerald-400">
                -{coupon.discount}%
              </dd>
            </dl>
          )}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">
              ₹{total.toFixed(2)}
            </dd>
          </dl>
        </div>

        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          {loading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Processing...
            </>
          ) : (
            "Proceed to Checkout"
          )}
        </motion.button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default OrderSummary;
