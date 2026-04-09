import React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaUtensils } from "react-icons/fa";

const UpdateMenu = () => {
  const item = useLoaderData();
  const { register, handleSubmit, reset } = useForm();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const navigate = useNavigate();

  // image hosting key
  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  // console.log(image_hosting_key)
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
  const onSubmit = async (data) => {
    try {
      let imageUrl = item?.image;
      const imageFile = data?.image?.[0];

      if (imageFile) {
        const imageData = new FormData();
        imageData.append("image", imageFile);
        const hostingImg = await axiosPublic.post(image_hosting_api, imageData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        });
        if (!hostingImg?.data?.success) {
          throw new Error("Image upload failed");
        }
        imageUrl = hostingImg.data.data.display_url;
      }

      const menuItem = {
        name: data.name,
        category: data.category,
        price: parseFloat(data.price),
        recipe: data.recipe,
        image: imageUrl,
      };

      const postMenuItem = await axiosSecure.patch(`/menu/${item._id}`, menuItem);
      if (postMenuItem?.data?.success || postMenuItem?.status === 200) {
        reset();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your item updated successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/dashboard/manage-items");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: error?.response?.data?.message || error.message,
      });
    }
  };
  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">
        Update This <span className="text-green">Menu Item</span>
      </h2>

      {/* form here */}
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Recipe Name*</span>
            </label>
            <input
              type="text"
              defaultValue={item.name}
              {...register("name", { required: true })}
              placeholder="Recipe Name"
              className="input input-bordered w-full "
            />
          </div>

          {/* 2nd row */}
          <div className="flex items-center gap-4">
            {/* categories */}
            <div className="form-control w-full my-6">
              <label className="label">
                <span className="label-text">Category*</span>
              </label>
              <select
                {...register("category", { required: true })}
                className="select select-bordered"
                defaultValue={item.category}
              >
                <option disabled value="default">
                  Select a category
                </option>
                <option value="salad">Salad</option>
                <option value="pizza">Pizza</option>
                <option value="soup">Soup</option>
                <option value="dessert">dessert</option>
                <option value="drinks">Drinks</option>
                <option value="popular">Popular</option>
              </select>
            </div>

            {/* prices */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Price*</span>
              </label>
              <input
                type="number"
                defaultValue={item.price}
                {...register("price", { required: true })}
                placeholder="Price"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* 3rd row */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Recipe Details</span>
            </label>
            <textarea
              defaultValue={item.recipe}
              {...register("recipe", { required: true })}
              className="textarea textarea-bordered h-24"
              placeholder="Tell the worlds about your recipe"
            ></textarea>
          </div>

          {/* 4th row */}
          <div className="form-control w-full my-6">
            <input
              {...register("image")}
              type="file"
              className="file-input w-full max-w-xs"
            />
            <p className="text-xs text-gray-500 mt-2">
              Optional: upload a new image only if you want to replace the existing one.
            </p>
          </div>

          <button className="btn bg-green text-white px-6">
            Update Item <FaUtensils />
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateMenu;
