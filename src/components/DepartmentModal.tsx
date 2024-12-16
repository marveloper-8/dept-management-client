import { CREATE_DEPARTMENT, UPDATE_DEPARTMENT } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSave, FaTimes } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

const DepartmentModal: FC<any> = ({ department, onClose, onSuccess }) => {
    const [name, setName] = useState(department?.name || '');
    const [subDepartments, setSubDepartments] = useState(
      department?.subDepartments?.map((sd: any) => sd.name) || ['']
    );
  
    const [createDepartment] = useMutation(CREATE_DEPARTMENT, {
      onCompleted: onSuccess
    });
  
    const [updateDepartment] = useMutation(UPDATE_DEPARTMENT, {
      onCompleted: onSuccess
    });
  
    const handleSubmit = (e: any) => {
      e.preventDefault();
      
      const cleanedSubDepartments = subDepartments
        .filter((sd: any) => sd.trim() !== '')
        .map((name: any) => ({ name }));
  
      if (department) {
        updateDepartment({ 
          variables: { 
            id: Number(department.id), 
            name 
          } 
        });
      } else {
        createDepartment({ 
          variables: { 
            input: { 
              name, 
              subDepartments: cleanedSubDepartments 
            } 
          } 
        });
      }
    };
  
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="bg-blue-500 text-white p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {department ? 'Edit Department' : 'Create Department'}
            </h2>
            <motion.button
              whileHover={{ rotate: 90 }}
              onClick={onClose}
              className="text-white hover:text-blue-100"
            >
              <FaTimes size={24} />
            </motion.button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Department Name</label>
              <motion.input
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
                placeholder="Enter department name"
              />
            </div>
  
            {!department && (
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Sub-Departments</label>
                <AnimatePresence>
                  {subDepartments.map((sd: any, index: number) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex mb-2 space-x-2"
                    >
                      <input
                        type="text"
                        value={sd}
                        onChange={(e) => {
                          const newSubs = [...subDepartments];
                          newSubs[index] = e.target.value;
                          setSubDepartments(newSubs);
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="Sub-Department Name"
                      />
                      {index === subDepartments.length - 1 && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSubDepartments([...subDepartments, ''])}
                          className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition"
                        >
                          <FaPlus size={20} />
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
  
            <div className="flex justify-end space-x-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-5 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition flex items-center"
              >
                <FaTimes className="mr-2" /> Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
              >
                <FaSave className="mr-2" />
                {department ? 'Update' : 'Create'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
}

export default DepartmentModal