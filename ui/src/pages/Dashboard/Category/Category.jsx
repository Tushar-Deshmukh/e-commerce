import React, { useState } from "react";
import AddCateory from "./AddCateory";
import ListCategory from "./ListCategory";

const Category = () => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [categoryId, setCategoryId] = useState(null);

  const handleEditCategoryClick = (id) => {
    setIsAddingCategory(true)
    setIsEditingCategory(true);
    setCategoryId(id);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Category</h3>
        {isAddingCategory ? (
          <button
            className="btn bg-white font-normal"
            onClick={() => setIsAddingCategory(false)}
          >
            Cancel
          </button>
        ) : (
          <button
            className="btn bg-white font-normal"
            onClick={() => setIsAddingCategory(true)}
          >
            Add
          </button>
        )}
      </div>

      <hr className="my-4 text-gray-400" />

      {isAddingCategory ? (
        <AddCateory
          setIsAddingCategory={setIsAddingCategory}
          isEditingCategory={isEditingCategory}
          setIsEditingCategory={setIsEditingCategory}
          categoryId={categoryId}
        />
      ) : (
        <ListCategory handleEditCategoryClick={handleEditCategoryClick}/>
      )}
    </div>
  );
};

export default Category;
