import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://foodapp-client-xy6z.onrender.com/",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
