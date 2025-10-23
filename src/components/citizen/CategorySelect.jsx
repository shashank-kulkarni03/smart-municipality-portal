// src/components/citizen/CategorySelect.jsx
import React from "react";
import { COMPLAINT_CATEGORIES } from "../../utils/constants";

const CategorySelect = ({ selectedCategory, onSelect }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select Category *
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {COMPLAINT_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.name)}
            className={`p-4 border-2 rounded-lg transition-all ${
              selectedCategory === category.name
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-3xl mb-2">{category.icon}</div>
            <div className="text-sm font-medium text-gray-700">
              {category.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelect;
