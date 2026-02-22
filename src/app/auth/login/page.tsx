'use client'
import React,{useState} from 'react'
import Link from 'next/link';
 
 function LoginPage() {
   return (
        <div className="auth-container">
            <div className="auth-box">
                <h1 className='mb-2'>เข้าสู่ระบบ</h1>
                <form action="">
                    <input className='auth-input' type="text" placeholder='ชื่อผู้ใช้หรืออีเมล'/>
                    <input className='auth-input' type="password" placeholder='รหัสผ่าน'/>
                    <button type='submit' className='auth-button'>เข้าสู่ระบบ</button>
                </form>
                <p>ยังไม่มีบัญชี? <Link href="/auth/register" className='text-green-600'>ลงทะเบียน</Link></p>
            </div>
        </div>
   )
 }
 
 export default LoginPage