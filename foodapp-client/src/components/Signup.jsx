import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";

const Signup = () => {
  const { signUpWithGmail, createUser, updateUserProfile } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password, name } = data;
    
    try {
      const result = await createUser(email, password);
      // Update Firebase profile with name
      await updateUserProfile(name, "");
      
      const userInfo = { name, email };
      
      // Save user to MongoDB
      const response = await axiosPublic.post("/users", userInfo);
      
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Signup Successful!',
          showConfirmButton: false,
          timer: 1500
        });
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: error.message,
      });
    }
  };

  const handleRegister = () => {
    signUpWithGmail()
      .then((result) => {
        const userInfo = {
          name: result?.user?.displayName,
          email: result?.user?.email,
        };
        // Using POST - your backend should handle the "already exists" logic
        axiosPublic.post("/users", userInfo).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            showConfirmButton: false,
            timer: 1500
          });
          navigate(from, { replace: true });
        });
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20 rounded-xl">
      <div className="mb-5 w-full">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg text-center">Create An Account</h3>
          
          <div className="form-control">
            <label className="label"><span className="label-text">Name</span></label>
            <input
              type="text"
              placeholder="Your name"
              className={`input input-bordered ${errors.name ? "input-error" : ""}`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <span className="text-red text-xs mt-1">{errors.name.message}</span>}
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Email</span></label>
            <input
              type="email"
              placeholder="email@example.com"
              className={`input input-bordered ${errors.email ? "input-error" : ""}`}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <span className="text-red text-xs mt-1">{errors.email.message}</span>}
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Password</span></label>
            <input
              type="password"
              placeholder="min 6 characters"
              className={`input input-bordered ${errors.password ? "input-error" : ""}`}
              {...register("password", { required: "Password is required", minLength: {value: 6, message: "Password must be at least 6 characters"} })}
            />
            {errors.password && <span className="text-red text-xs mt-1">{errors.password.message}</span>}
          </div>

          <div className="form-control mt-6">
            <button type="submit" className="btn bg-green text-white border-none">Sign Up</button>
          </div>

          <p className="text-center my-2">
            Already have an account? 
            <Link to="/login" className="ml-2 underline text-red">Login</Link>
          </p>
        </form>

        <div className="text-center space-x-3 pb-8">
          <button onClick={handleRegister} className="btn btn-circle hover:bg-green hover:text-white"><FaGoogle /></button>
          <button className="btn btn-circle hover:bg-green hover:text-white"><FaFacebookF /></button>
          <button className="btn btn-circle hover:bg-green hover:text-white"><FaGithub /></button>
        </div>
      </div>
    </div>
  );
};

export default Signup;