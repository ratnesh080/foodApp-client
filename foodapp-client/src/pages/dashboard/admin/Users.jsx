import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaTrashAlt, FaUsers } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const Users = () => {
  const axiosSecure = useAxiosSecure();
  
  const { refetch, data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data?.data?.items || res.data?.items || res.data?.data || res.data;
    },
  });

  // Handle Make Admin
  const handleMakeAdmin = (user) => {
    axiosSecure.patch(`/users/admin/${user._id}`).then((res) => {
      if (res.status === 200) {
        refetch();
        Swal.fire({
          position: "center",
          icon: "success",
          title: `${user.name} is now an Admin!`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }).catch(err => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to update user role!',
        });
    });
  };

  // Handle Delete User
  const handleDeleteUser = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
      buttonsStyling: true,
      customClass: {
    confirmButton: 'btn bg-green text-white border-none mx-2', // Adding your own classes
    cancelButton: 'btn bg-red text-white border-none mx-2'
  }
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${user._id}`).then((res) => {
          if (res.status === 200) {
            refetch();
            Swal.fire("Deleted!", "User has been removed.", "success");
          }
        });
      }
    });
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <div className="flex items-center justify-between m-4">
        <h5 className="text-xl font-semibold">All Users</h5>
        <h5 className="font-medium">Total users: {users.length}</h5>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-green text-white rounded-lg">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}> {/* Fixed: Use user._id instead of index */}
                <th>{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.role === "admin" ? (
                    <span className="badge badge-sm bg-orange-500 text-white border-none py-3 px-4">Admin</span>
                  ) : (
                    <button
                      onClick={() => handleMakeAdmin(user)}
                      className="btn btn-xs btn-circle bg-indigo-500 text-white hover:bg-indigo-700"
                      title="Make Admin"
                    >
                      <FaUsers />
                    </button>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="btn btn-xs bg-red text-white hover:bg-orange-600"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;