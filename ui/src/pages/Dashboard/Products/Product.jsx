import React, { useState } from "react";
import AddProduct from "./AddProduct";
import ListProducts from "./ListProducts";

const Product = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productId, setProductId] = useState(null);

  const handleEditProductClick = (id) => {
    setIsAddingProduct(true);
    setIsEditingProduct(true);
    setProductId(id);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Product</h3>
        {isAddingProduct ? (
          <button
            className="btn bg-white font-normal"
            onClick={() => setIsAddingProduct(false)}
          >
            Cancel
          </button>
        ) : (
          <button
            className="btn bg-white font-normal"
            onClick={() => setIsAddingProduct(true)}
          >
            Add
          </button>
        )}
      </div>

      <hr className="my-4 text-gray-400" />

      {isAddingProduct ? (
        <AddProduct
          setIsAddingProduct={setIsAddingProduct}
          isEditingProduct={isEditingProduct}
          setIsEditingProduct={setIsEditingProduct}
          productId={productId}
        />
      ) : (
        <ListProducts handleEditProductClick={handleEditProductClick} />
      )}
    </div>
  );
};

export default Product;
