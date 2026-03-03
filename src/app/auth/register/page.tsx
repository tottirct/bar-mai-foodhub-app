'use client'
import React,{useState} from 'react';
import Link from 'next/link';
import { AuthBox } from '@/components/auth/AuthBox';
import { AuthButton } from '@/components/auth/AuthBotton';
import { AuthInput } from '@/components/auth/AuthInput';
 
 function RegisterPage() {

    const [username,setusername] = useState('');
    const [email,setemail] = useState('');
    const [name,setname] = useState('');
    const [password,setpassword] = useState('');
    const [confirmPassword,setconfirmPassword] = useState('');
    const [success,setsuccess] = useState('');

    const [error,seterror] = useState('');

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(password !== confirmPassword){
            seterror('รหัสผ่านไม่ตรงกัน');
            return;
        }

        if(!username || !email || !name || !password || !confirmPassword){
            seterror('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        try{
            const resCheck = await fetch('/api/auth/checkUser',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })

            const {user} = await resCheck.json();
            if(user){
                seterror('อีเมลนี้ถูกใช้แล้ว');
                return;
            }

            const response = await fetch('/api/auth/register',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, name, password })
            })

            if(response.ok){
                const form = e.target as HTMLFormElement;
                seterror('');
                setsuccess('ลงทะเบียนสําเร็จ');
                form.reset();
            } else {
                console.log('Registration failed.');
            }

        }catch(error){
            console.log('Error during registration: ', error);
        }
    }

   return (
        <div className="min-h-full flex items-center justify-center px-4">
            <AuthBox>
                <h1 className='mb-2'>ลงทะเบียน</h1>
                <form onSubmit={handleSubmit}>
                    {error && <p className='text-red-600'>{error}</p>}
                    {success && <p className='text-green-600'>{success}</p>}
                    <AuthInput type='text' placeholder='ชื่อผู้ใช้' onChange={(e) => setusername(e.target.value)}/>
                    <AuthInput type='email' placeholder='อีเมล' onChange={(e) => setemail(e.target.value)}/>
                    <AuthInput type='text' placeholder='ชื่อ' onChange={(e) => setname(e.target.value)}/>
                    <AuthInput type='password' placeholder='รหัสผ่าน' onChange={(e) => setpassword(e.target.value)}/>
                    <AuthInput type='password' placeholder='ยืนยันรหัสผ่าน' onChange={(e) => setconfirmPassword(e.target.value)}/>
                    <AuthButton text='ลงทะเบียน' type='submit'/>
                </form>
                <p>มีบัญชีแล้ว? <Link href="/auth/login" className='text-green-600'>เข้าสู่ระบบ</Link></p>
            </AuthBox>
        </div>
   )
 }
 
 export default RegisterPage
 