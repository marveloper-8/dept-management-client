import { CREATE_DEPARTMENT, UPDATE_DEPARTMENT } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { FC, useState } from "react";
import { FaPencil } from "react-icons/fa6";

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
        // Update existing department
        updateDepartment({ 
          variables: { 
            id: Number(department.id), 
            name 
          } 
        });
      } else {
        // Create new department
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">
            {department ? 'Edit Department' : 'Create Department'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Department Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
  
            {!department && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Sub-Departments</label>
                {subDepartments.map((sd: any, index: number) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={sd}
                      onChange={(e) => {
                        const newSubs = [...subDepartments];
                        newSubs[index] = e.target.value;
                        setSubDepartments(newSubs);
                      }}
                      className="w-full px-3 py-2 border rounded mr-2"
                      placeholder="Sub-Department Name"
                    />
                    {index === subDepartments.length - 1 && (
                      <button
                        type="button"
                        onClick={() => setSubDepartments([...subDepartments, ''])}
                        className="bg-green-500 text-white px-3 py-2 rounded"
                      >
                        <FaPencil size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
  
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {department ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}

export default DepartmentModal