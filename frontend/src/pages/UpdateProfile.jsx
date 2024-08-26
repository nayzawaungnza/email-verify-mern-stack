import React, {useState} from 'react'
import { motion } from 'framer-motion';
import {Link, useNavigate, useParams} from 'react-router-dom';
import Input from '../components/Input';
import {User,Mail, ArrowLeft, Loader} from 'lucide-react'
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
function UpdateProfile() {
    const { id } = useParams();
    const {user, isLoading, updateProfile} = useAuthStore();

    const [name, setName] = useState(user.name);
	const [email, setEmail] = useState(user.email);
	const navigate = useNavigate();

    const handleUpdateProfile = async (e) =>{
        e.preventDefault();
        const data = {
            name,
            email
        };
        try {
            //console.log('Updating profile with data:', id, data);
            await updateProfile(id,data);
            toast.success("Profile Updated successfully, redirecting to dashboard page...");
			setTimeout(() => {
				navigate("/");
			}, 2000);
        } catch (error) {
            console.error(error);
			toast.error(error.message || "Error updating profile");
        }
    }

  return (
    <motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8'>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Update Profile
				</h2>
            <form onSubmit={handleUpdateProfile}>
            <Input 
                        icon={User}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type='text'
						placeholder='Full Name' />
                    <Input
						icon={Mail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
						type='email'
						placeholder='Email Address'/>

                    <motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
							type='submit'
						>
							{isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Update Profile"}
					</motion.button>
            </form>
            </div>
            <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<Link to={"/"} className='text-sm text-green-400 hover:underline flex items-center'>
					<ArrowLeft className='h-4 w-4 mr-2' /> Back to Dashboard
				</Link>
			</div>
        </motion.div>
  )
}

export default UpdateProfile
