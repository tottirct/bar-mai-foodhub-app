'use client';
import React,{useState,useEffect} from 'react'
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AuthBox } from '@/components/auth/AuthBox';
import { AuthButton } from '@/components/auth/AuthBotton';
import { AuthInput } from '@/components/auth/AuthInput';
 
 function LoginPage() {

   const [username,setusername] = useState('');
   const [password,setpassword] = useState('');
   const [error,seterror] = useState('');

   const router = useRouter();
   const { data: session, status } = useSession();

   useEffect(() => {
   console.log("Status:", status);
   console.log("Session:", session);
   if (status === 'authenticated') {
       const role = session?.user?.role;
       console.log("Role found:", role);
       if (role === 'ADMIN') router.push('/admin');
       else if (role === 'OWNER') router.push('/owner');
       else router.push('/customer');
   }
   }, [status, session, router]);

   const handlerSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault();
       try{
        const res = await signIn('credentials', {
            username,
            password,
            redirect: false
        })

        if(res?.error){
            seterror("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
            return;
        }

       }catch(error){
           console.log(error);
       }
    }

   return (
        <div className="min-h-full flex items-center justify-center px-4">
            <AuthBox>
                <h1 className='mb-2'>เข้าสู่ระบบ</h1>
                <form onSubmit={handlerSubmit}>
                    {error && <p className='text-red-600'>{error}</p>}
                    <AuthInput type="text" placeholder="ชื่อผู้ใช้" onChange={(e) => setusername(e.target.value)} />
                    <AuthInput type="password" placeholder="รหัสผ่าน" onChange={(e) => setpassword(e.target.value)} />
                    <AuthButton type="submit" text="เข้าสู่ระบบ"/>
                </form>
                <p>ยังไม่มีบัญชี? <Link href="/auth/register" className='text-green-600'>ลงทะเบียน</Link></p>
            </AuthBox>
        </div>
   )
 }
 
 export default LoginPage