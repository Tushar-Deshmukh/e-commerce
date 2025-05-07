import React, { useEffect, useState } from "react";
import axios from "../../../axios";
import { ApiConfig } from "../../../config/ApiConfig";

const ListCategory = ({handleEditCategoryClick}) => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(ApiConfig.getAllCatgories);
      console.log(res);
      if (res.data?.status === "success") {
        setCategories(res?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      {categories &&
        categories.length > 0 &&
        categories.map((category) => {
          return (
            <div
              key={category.id}
              className="bg-white hover:bg-gray-100 hover:cursor-pointer p-4 my-4 border border-gray-200 rounded-sm"
              role='button'
              onClick={() => handleEditCategoryClick(category.id)}
            >
              <h4 className="text-lg mb-3">{category.name}</h4>
              <p className="font-light text-sm">{category.description}</p>
            </div>
          );
        })}
    </div>
  );
};

export default ListCategory;
