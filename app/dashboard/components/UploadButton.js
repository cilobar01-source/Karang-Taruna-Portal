"use client";
import { useState } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import toast from 'react-hot-toast';

export default function UploadButton({onUploaded}){
  const [loading,setLoading]=useState(false);
  const handle=async(e)=>{
    const files=e.target.files;
    if(!files.length)return;
    setLoading(true);
    try{
      const urls=await uploadToCloudinary(files);
      onUploaded(urls);
      toast.success(`${urls.length} gambar terunggah`);
    }catch(err){
      toast.error(err.message);
    }finally{setLoading(false)}
  };
  return(<div><input type='file' multiple accept='image/*' onChange={handle} disabled={loading}/>{loading&&<p className='note'>📤 Mengunggah...</p>}</div>);
}
