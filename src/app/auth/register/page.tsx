'use client'
import React,{useState} from 'react'
 
 function RegisterPage() {
   return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>ลงทะเบียน</h1>
                <form action="">
                    <input className='auth-input' type="text" placeholder='ชื่อผู้ใช้'/>
                    <input className='auth-input' type="email" placeholder='อีเมล'/>
                    <input className='auth-input' type="text" placeholder='ชื่อ-นามสกุล'/>
                    <input className='auth-input' type="password" placeholder='รหัสผ่าน'/>
                    <input className='auth-input' type="password" placeholder='ยืนยันรหัสผ่าน'/>
                    <button type='submit' className='auth-button'>ลงทะเบียน</button>
                </form>
            </div>
        </div>
   )
 }
 
 export default RegisterPage
 