'use client'

import DepartmentModal from "@/components/DepartmentModal";
import { DELETE_DEPARTMENT, GET_DEPARTMENTS } from "@/graphql/mutations"
import { AnimatePresence, motion } from 'framer-motion'
import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";


export default function DepartmentsPage() {
  const router = useRouter()
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_DEPARTMENTS, {
    variables: { limit: 10, offset: 0 }
  });

  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT, {
    onCompleted: () => refetch()
  });

  const handleDelete = (id: any) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      deleteDepartment({ variables: { id: Number(id) } });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-24 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center sm:text-left w-full sm:w-auto">
            Departments
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center sm:justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center bg-blue-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-md hover:bg-blue-600 transition w-full sm:w-auto text-center justify-center"
            >
              <FaPlus className="mr-2" /> Create Department
            </motion.button>

            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center bg-red-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-md hover:bg-red-600 transition w-full sm:w-auto text-center justify-center"
            >
              Logout
            </motion.button>
          </div>
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600"
          >
            Loading departments...
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-500"
          >
            Error: {error.message}
          </motion.div>
        )}

        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {data.getDepartments.map((dept: any) => (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{dept.name}</h2>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDepartment(dept)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit size={20} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(dept.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash size={20} />
                      </motion.button>
                    </div>
                  </div>
                  {dept.subDepartments && dept.subDepartments.length > 0 && (
                    <div className="mt-2 pl-2 border-l-4 border-blue-300">
                      <p className="text-sm text-gray-600 mb-2">Sub-Departments:</p>
                      {dept.subDepartments.map((subDept: any) => (
                        <motion.p
                          key={subDept.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-sm text-gray-700 pl-2"
                        >
                          • {subDept.name}
                        </motion.p>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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