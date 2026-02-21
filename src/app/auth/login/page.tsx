'use client'
import React,{useState} from 'react'
 
 function LoginPage() {
   return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>เข้าสู่ระบบ</h1>
                <form action="">
                    <input className='auth-input' type="text" placeholder='ชื่อผู้ใช้หรืออีเมล'/>
                    <input className='auth-input' type="password" placeholder='รหัสผ่าน'/>
                    <button type='submit' className='auth-button'>เข้าสู่ระบบ</button>
                </form>
            </div>
        </div>
   )
 }
 
 export default LoginPage