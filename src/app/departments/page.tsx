'use client'

import DepartmentModal from "@/components/DepartmentModal";
import { DELETE_DEPARTMENT, GET_DEPARTMENTS } from "@/graphql/mutations"
import { requireAuth } from "@/lib/auth"
import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react";
import { FaPencil, FaPlus, FaTrash } from "react-icons/fa6";


export default function DepartmentsPage() {
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
    const { loading, error, data, refetch } = useQuery(GET_DEPARTMENTS, {
      variables: { limit: 10, offset: 0 }
    });
  
    const [deleteDepartment, {deleteLoading}] = useMutation(DELETE_DEPARTMENT, {
      onCompleted: () => refetch()
    });
  
    const handleDelete = (id: any) => {
      if (window.confirm('Are you sure you want to delete this department?')) {
        deleteDepartment({ variables: { id: Number(id) } });
      }
    };
  
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Departments</h1>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            <FaPlus className="mr-2" /> Create Department
          </button>
        </div>
  
        {loading && <p>Loading departments...</p>}
        {error && <p>Error: {error.message}</p>}
  
        {data && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.getDepartments.map((dept: any) => (
              <div 
                key={dept.id} 
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">{dept.name}</h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setSelectedDepartment(dept)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaPencil size={20} />
                    </button>
                    <button 
                      onClick={() => handleDelete(dept.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </div>
                {dept.subDepartments && dept.subDepartments.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Sub-Departments:</p>
                    {dept.subDepartments.map((subDept: any) => (
                      <p key={subDept.id} className="text-sm pl-2">
                        • {subDept.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
  
        {/* Create/Edit Department Modal */}
        {(isCreateModalOpen || selectedDepartment) && (
          <DepartmentModal 
            department={selectedDepartment}
            onClose={() => {
              setSelectedDepartment(null);
              setIsCreateModalOpen(false);
            }}
            onSuccess={() => {
              refetch();
              setSelectedDepartment(null);
              setIsCreateModalOpen(false);
            }}
          />
        )}
      </div>
    );
}