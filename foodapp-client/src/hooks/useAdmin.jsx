import React from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useAdmin = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: isAdmin,
    isPending: isAdminLoading,
  } = useQuery({
    queryKey: [user?.email, "isAdmin"],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/admin/${user?.email}`);
      return Boolean(res.data?.data?.admin ?? res.data?.admin);
    },
  });

  return [isAdmin, isAdminLoading];
};

export default useAdmin;
