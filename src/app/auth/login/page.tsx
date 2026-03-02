'use client'
import React,{useState} from 'react'
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
 
 function LoginPage() {

   const [email,setemail] = useState('');
   const [password,setpassword] = useState('');
   const [error,seterror] = useState('');

   const router = useRouter();

   const handlerSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault();
       try{
        const res = await signIn('credentials', {
            email,
            password,
            redirect: false
        })

        if(res?.error){
            seterror("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            return;
        }

        router.replace('/customer');
       }catch(error){
           console.log(error);
       }
    }

   return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className='mb-2'>เข้าสู่ระบบ</h1>
                <form onSubmit={handlerSubmit}>
                    {error && <p className='text-red-600'>{error}</p>}
                    <input onChange={(e) => setemail(e.target.value)} className='auth-input' type="email" placeholder='อีเมล'/>
                    <input onChange={(e) => setpassword(e.target.value)} className='auth-input' type="password" placeholder='รหัสผ่าน'/>
                    <button type='submit' className='auth-button'>เข้าสู่ระบบ</button>
                </form>
                <p>ยังไม่มีบัญชี? <Link href="/auth/register" className='text-green-600'>ลงทะเบียน</Link></p>
            </div>
        </div>
   )
 }
 
 export default LoginPage