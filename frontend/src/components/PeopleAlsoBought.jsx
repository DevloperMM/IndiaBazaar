import React, { useEffect } from "react";
import ProductCard from "./ProductCard.jsx";
import { useProductStore } from "../store/useProductStore.js";
import Loader from "./Loader.jsx";

function PeopleAlsoBought() {
  const { loading, fetchRecommendations, products } = useProductStore();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="my-4">
      <h3 className="mb-4 text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3">
        {products?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default PeopleAlsoBought;
