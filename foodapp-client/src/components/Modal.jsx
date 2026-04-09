import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";

const Modal = () => {
  const [errorMessage, seterrorMessage] = useState("");
  const { signUpWithGmail, login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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
        document.getElementById("my_modal_5").close();
        navigate(from, { replace: true });
        reset(); // Only reset on success
      })
      .catch((error) => {
        seterrorMessage("Invalid email or password!");
      });
  };

  const handleRegister = () => {
    signUpWithGmail()
      .then((result) => {
        const userInfo = {
          name: result?.user?.displayName,
          email: result?.user?.email,
        };
        // Ensure user is synced with backend
        axios.post("http://localhost:6001/users", userInfo).then(() => {
          document.getElementById("my_modal_5").close();
          navigate("/");
        });
      })
      .catch((error) => console.log(error));
  };

  return (
    <dialog id="my_modal_5" className="modal modal-middle sm:modal-middle">
      <div className="modal-box">
        <div className="modal-action flex-col justify-center mt-0">
          <form
            className="card-body"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="font-bold text-lg text-center">Please Login!</h3>

            {/* email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                {...register("email", { required: true })}
              />
            </div>

            {/* password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                {...register("password", { required: true })}
              />
              <label className="label">
                <button type="button" className="label-text-alt link link-hover mt-2">
                  Forgot password?
                </button>
              </label>
            </div>

            {/* error message */}
            {errorMessage && (
              <p className="text-red-500 text-xs italic text-center">
                {errorMessage}
              </p>
            )}

            {/* submit btn */}
            <div className="form-control mt-4">
              <input
                type="submit"
                className="btn bg-green text-white border-none"
                value="Login"
              />
            </div>

            {/* close btn */}
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => {
                seterrorMessage("");
                document.getElementById("my_modal_5").close();
              }}
            >
              ✕
            </button>

            <p className="text-center my-2">
              Don't have an account?
              <Link 
                to="/signup" 
                className="underline text-red ml-1"
                onClick={() => document.getElementById("my_modal_5").close()} // Close on redirect
              >
                Signup Now
              </Link>
            </p>
          </form>

          <div className="text-center space-x-3 mb-5">
            <button onClick={handleRegister} className="btn btn-circle hover:bg-green hover:text-white">
              <FaGoogle />
            </button>
            <button className="btn btn-circle hover:bg-green hover:text-white"><FaFacebookF /></button>
            <button className="btn btn-circle hover:bg-green hover:text-white"><FaGithub /></button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;