import react, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Verify()
{
    const navigate = useNavigate();
    const email = localStorage.getItem("userEmail");
    const [otp,setOtp] = useState(); 
    const handleVerify = async (e) =>{
        console.log(otp);
        e.preventDefault();
        try{

            const res = await fetch(`http://localhost:8080/api/users/verify-otp?email=${localStorage.getItem("userEmail")}&otp=${otp}`,{
                method : "POST",
            });
            if(res.ok)
            {
                navigate('/dashboard');
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }
    const handleChange = (a) =>{
        setOtp(a.target.value);
    }
    // const userEmail=localStorage.getItem("userEmail");
    // console.log("User email in OTP verification:",userEmail);
    return(
        <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
            <div className='h-auto bg-white p-8 rounded-2xl shadow-lg w-96 mx-auto'>
            <h1 className='text-4xl text-pink-500 '>OTP Verification </h1>
            
            <form className='mt-4' onSubmit={handleVerify}>
                <div className='mb-4'>
                    <h1>Email : {email}</h1><br></br>
                    <label className='block text-gray-700 font-medium mb-2'>Enter OTP</label>
                    <input type="text" placeholder='Enter OTP' onChange={handleChange}  className='w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-pink-400'/>
                </div>
                <button type='submit' className='w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition'>Verify OTP</button>
            </form>
            </div>
        </div>
    );
}

export default Verify;