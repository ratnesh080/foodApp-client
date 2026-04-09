import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth"; // Cleaner than importing useContext(AuthContext)
import useAxiosSecure from "./useAxiosSecure";

const useCart = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { refetch, data: cart = [] } = useQuery({
    queryKey: ["carts", user?.email],
    // Safety switch: only run the query if loading is finished and user email exists
    enabled: !loading && !!user?.email, 
    queryFn: async () => {
      const res = await axiosSecure.get(`/carts?email=${user?.email}`);
      return res.data;
    },
  });

  return [cart, refetch];
};

export default useCart;