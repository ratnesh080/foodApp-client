import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthProvider'
import { useForm } from 'react-hook-form';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import Swal from 'sweetalert2';

const UserProfile = () => {
    const { updateUserProfile } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Image hosting details
    const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

    const onSubmit = async (data) => {
        const name = data.name;
        const imageFile = data.photoURL[0];

        try {
            let photoURL = "";

            // 1. Upload image to ImgBB if a file is selected
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                const res = await axiosPublic.post(image_hosting_api, formData, {
                    headers: { 'content-type': 'multipart/form-data' }
                });

                if (res.data.success) {
                    photoURL = res.data.data.display_url;
                }
            }

            // 2. Update Firebase Profile
            await updateUserProfile(name, photoURL);
            
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Profile updated successfully",
                showConfirmButton: false,
                timer: 1500
            });
            
        } catch (error) {
            console.error("Profile update error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    }

    return (
        <div className='h-screen max-w-md mx-auto flex items-center justify-center'>
            <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Name</span>
                        </label>
                        <input 
                            type="text" 
                            {...register("name", { required: true })} 
                            placeholder="Your name" 
                            className="input input-bordered" 
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Replace Photo</span>
                        </label>
                        <input 
                            type="file" 
                            {...register("photoURL")} 
                            className="file-input file-input-bordered w-full mt-1" 
                        />
                    </div>
                    <div className="form-control mt-6">
                        <button type='submit' className="btn bg-green text-white">Update Profile</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserProfile;