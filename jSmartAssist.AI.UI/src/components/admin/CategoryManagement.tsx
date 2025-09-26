import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import apiService from '../../services/apiService';
import { Category } from '../../types';

interface CategoryManagementProps {
    categories: Category[];
    onRefresh: () => void;
}


const CategoryManagement: React.FC<CategoryManagementProps> = ({ categories, onRefresh }) => {
    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await apiService.deleteCategory(id);
                onRefresh();
            } catch (error) {
                alert('Failed to delete category');
            }
        }
    };
    // In CategoryManagement.tsx, add this handler:
    const handleSeedCategories = async () => {
        try {
            await apiService.seedCategories();
            alert('Default categories added!');
            onRefresh(); // This will reload the data
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add categories');
        }
    };
    //const handleSeedCategories = async () => {
    //    if (window.confirm('This will add default categories. Continue?')) {
    //        try {
    //            await apiService.seedCategories();
    //            onRefresh();
    //            alert('Default categories added successfully!');
    //        } catch (error) {
    //            alert('Failed to seed categories');
    //        }
    //    }
    //};

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
                <div className="flex space-x-2">
                    {categories.length === 0 && (
                        <button
                            onClick={handleSeedCategories}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 inline-flex items-center"
                        >
                            Add Default Categories
                        </button>
                    )}
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                            <button
                                onClick={() => handleDelete(category.id)}
                                className="text-red-400 hover:text-red-600"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                {category.documentCount} documents
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {category.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="col-span-3 text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500 mb-4">No categories yet</p>
                        <button
                            onClick={handleSeedCategories}
                            className="text-blue-600 hover:text-blue-500"
                        >
                            Add default categories to get started
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CategoryManagement;

