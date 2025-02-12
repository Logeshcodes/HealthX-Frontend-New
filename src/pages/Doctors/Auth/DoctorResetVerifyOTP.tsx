import  { useState , useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { verifyResetOtp , forgotResendOtp } from '../../../api/auth/DoctorAuthentication';


const DoctorResetVerificationOTP = () => {
  
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
  const [counter, setCounter] = useState<number>(10);
  const [resendAtive,setResendActive]=useState(false)
 

  const navigate = useNavigate();

  console.log("otp", otp)



  useEffect(()=>{
    
     
    if(counter>0){
      const timer=setInterval(()=>{
        setCounter(prev=>prev-1)
      },1000)
      return()=>    clearInterval(timer)
    }else{
      setResendActive(true)
    }
   
    }

  ,[counter,otp])




   const handleResend=async()=>{
    setResendActive(false)
    setCounter(10)

    let email= localStorage.getItem("ForgotPassEmail")|| ""
    const respone=await forgotResendOtp(email)

    if(respone.success){
      toast.success(respone.message)
    }else{
      toast.error(respone.message)
    }
    
    
  }


  const handleChange=(e:React.ChangeEvent<HTMLInputElement>,index:number)=>{
    
    const value=e.target.value

    const newOTP= [...otp]
    newOTP[index]=value
    setOtp(newOTP)

    if(value && index<otp.length-1){
      const nextSibling=document.getElementById(`otpInput-${index+1}`)
      nextSibling?.focus()
    }else if (!value && index > 0) {
      const prevSibling = document.getElementById(`otpInput-${index - 1}`);
      prevSibling?.focus();
    }

    

  }


  const handleKeyDown=(e:React.KeyboardEvent<HTMLInputElement>,index:number)=>{
    if(e.key==="Backspace" && !otp[index] && index>0){
      document.getElementById(`otpInput-${index-1}`)?.focus()
    }
  }



  const handleSubmit=async ()=>{
    let OTP=otp.join("")
    if(OTP.length==4){
      console.log("submit Clicked")
    }else{
     toast.error("enter full OTP")
      return 
    }
    let email= localStorage.getItem("ForgotPassEmail")|| ""
    let response=await verifyResetOtp(email,OTP)
    if(response.success){
      toast.success(response.message)
      
      navigate('/doctor/resetPassword')

    }else{
      toast.error(response.message)
    }
    
  }





  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <div className="h-12 w-12  rounded-xl flex items-center justify-center mb-4">
              {/* <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg> */}
              <img src="../../../Logo.png" alt="Logo" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800"> Verify Your Email Address</h2>
            <p className="text-gray-600 mt-2">Email verification OTP has been sent to your Email. Please enter the OTP below</p>
          </div>
          



            <div className="flex space-x-2 p-3 pl-24">
            
            {
                otp.map((value,index)=>(
                  <input
                type="text"
                key={index}
                maxLength={1}
                value={value}
                id={`otpInput-${index}`}
                onKeyDown={(e)=>handleKeyDown(e,index)}
                onChange={(e)=>handleChange(e,index)}
                className="no-spinner bg-gray-100 rounded-md w-10 h-10 border-black border-2 outline-1 hover:shadow-[3px_3px_0px_0px_rgb(88,22,135,0.5)] text-black text-center"
              />
              ))
            }
            
          </div>

          <div className="p-3">
          
          <span onClick={handleSubmit}>
          <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Continue
            </button>
          </span>
          
          
        </div>



        <div className="text-center">
          {
            resendAtive?<button typeof="button" onClick={handleResend} className="text-red-600">Resend OTP</button>:<span className="text-red-500">{counter} seconds</span>
          }
          
        </div>
          
          
        </div>
        
        {/* Right side - Image */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-purple-400 to-purple-600 p-12">
          <div className="h-full flex items-center justify-center">
            <img
              src="../../../Login-template.png"
              alt="Reset Password"
              className="rounded-2xl max-w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorResetVerificationOTP;