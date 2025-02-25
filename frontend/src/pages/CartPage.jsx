import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import {
  CartItem,
  GiftCoupon,
  OrderSummary,
  Loader,
  PeopleAlsoBought,
} from "../components/index.js";
import { useCartStore } from "../store/useCartStore.js";

function CartPage() {
  const { cart, loading } = useCartStore();

  return !loading ? (
    <div>
      <div className="mx-8 max-w-screen-xl md:px-4 2xl:px-0">
        <div className="sm:mt-8 md:gap-2 lg:flex lg:items-start xl:gap-8">
          <motion.div
            className="mx-auto w-full md:w-3/5 flex-none lg:max-w-2xl xl:max-w-4xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {cart.length === 0 ? (
              <EmptyCartUI />
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-emerald-400">
                  Shopping Cart
                </h3>
                {cart.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            )}

            {cart.length > 0 && <PeopleAlsoBought />}
          </motion.div>

          {cart.length > 0 && (
            <motion.div
              className="my-4 max-w-4xl space-y-4 lg:mt-0 lg:w-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <OrderSummary />
              <GiftCoupon />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <Loader />
  );
}

export default CartPage;

const EmptyCartUI = () => (
  <motion.div
    className="flex flex-col items-center justify-center space-y-4 py-16"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <ShoppingCart className="h-24 w-24 text-gray-300" />
    <h3 className="text-2xl font-semibold ">Your cart is empty</h3>
    <p className="text-gray-400">
      Looks like you {"haven't"} added anything to your cart yet.
    </p>
    <Link
      className="mt-4 rounded-md bg-emerald-500 px-6 py-2 text-white transition-colors hover:bg-emerald-600"
      to="/"
    >
      Start Shopping
    </Link>
  </motion.div>
);
