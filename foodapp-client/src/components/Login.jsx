import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../hooks/useAxiosPublic";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

const Login = () => {
  const [errorMessage, seterrorMessage] = useState("");
  const { signUpWithGmail, login } = useAuth();
  const axiosPublic = useAxiosPublic();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // 1. Standard Login Handler
  const onSubmit = (data) => {
    const { email, password } = data;
    login(email, password)
      .then((result) => {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          showConfirmButton: false,
          timer: 1500
        });
        navigate(from, { replace: true });
      })
      .catch((error) => {
        seterrorMessage("Invalid email or password!");
        // Only reset password on error, or don't reset at all so they can fix it
      });
  };

  // 2. Google Login Handler (Synced with DB)
  const handleRegister = () => {
    signUpWithGmail()
      .then((result) => {
        const userInfo = {
          name: result?.user?.displayName,
          email: result?.user?.email,
        };
        axiosPublic.post("/users", userInfo).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Welcome Back!',
            showConfirmButton: false,
            timer: 1500
          });
          navigate(from, { replace: true });
        });
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="max-w-md bg-white shadow-xl w-full mx-auto flex items-center justify-center my-20 rounded-2xl border border-gray-100">
      <div className="mb-5 w-full">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-2xl text-center mb-4">Login</h3>

          {/* email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Email</span>
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className={`input input-bordered ${errors.email ? "input-error" : ""}`}
              {...register("email", { required: "Email is required" })}
            />
          </div>

          {/* password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Password</span>
            </label>
            <input
              type="password"
              placeholder="Your password"
              className={`input input-bordered ${errors.password ? "input-error" : ""}`}
              {...register("password", { required: "Password is required" })}
            />
            <label className="label">
              <button type="button" className="label-text-alt link link-hover mt-2">
                Forgot password?
              </button>
            </label>
          </div>

          {/* error message */}
          {errorMessage && (
            <p className="text-red text-xs italic text-center mt-2">
              {errorMessage}
            </p>
          )}

          {/* submit btn */}
          <div className="form-control mt-4">
            <input
              type="submit"
              className="btn bg-green text-white border-none hover:bg-emerald-600"
              value="Login"
            />
          </div>

          {/* close btn */}
          <Link to="/">
            <div className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">
              ✕
            </div>
          </Link>

          <p className="text-center my-4 text-sm">
            Don't have an account?
            <Link to="/signup" className="underline text-red font-semibold ml-1">
              Signup Now
            </Link>
          </p>
        </form>

        <div className="text-center space-x-3 pb-8">
          <hr className="mb-6 mx-8" />
          <button onClick={handleRegister} className="btn btn-circle hover:bg-green hover:text-white border-gray-300">
            <FaGoogle />
          </button>
          <button className="btn btn-circle hover:bg-green hover:text-white border-gray-300">
            <FaFacebookF />
          </button>
          <button className="btn btn-circle hover:bg-green hover:text-white border-gray-300">
            <FaGithub />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;