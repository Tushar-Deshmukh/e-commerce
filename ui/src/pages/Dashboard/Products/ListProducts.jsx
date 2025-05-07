import React, { useEffect, useState } from "react";
import productService from "../../../services/product.service";

const ListProducts = ({ handleEditProductClick }) => {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const data = await productService.getAllProducts();

      if (data.status === "success") {
        setProducts(data?.data?.records);
      }
    } catch (error) {
      setProducts([]);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (products.length === 0) {
    return <div className="text-center text-lg">No products.</div>;
  }

  return (
    <div>
      {products &&
        products.length > 0 &&
        products.map((product) => {
          return (
            <div
              key={product.id}
              className="flex items-center bg-white hover:bg-gray-100 hover:cursor-pointer border border-gray-200 my-4"
              role="button"
              onClick={() => handleEditProductClick(product?.id)}
            >
              <div className="h-28 w-28">
                <img
                  src={product?.thumbnail}
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>

              <div className="flex-1 p-4 rounded-sm">
                <h4 className="text-lg mb-3">{product?.name}</h4>
                <p className="font-light text-sm">{product?.description}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ListProducts;
