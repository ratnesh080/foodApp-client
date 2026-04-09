import React from "react";
import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useMenu = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: menu = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const res = await axiosPublic.get("/menu");
      const rawItems = res.data?.data?.items || res.data?.items || res.data?.data || res.data;
      if (!Array.isArray(rawItems)) return [];

      // Normalize id shape so admin actions work across old/new payload formats.
      return rawItems.map((item) => ({
        ...item,
        _id: item?._id || item?.id,
      }));
    },
  });

  return [menu, loading, refetch];
};

export default useMenu;
