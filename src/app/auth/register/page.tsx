'use client'
import React,{useState} from 'react'
import Link from 'next/link';
 
 function RegisterPage() {

    const [username,setusername] = useState('');
    const [email,setemail] = useState('');
    const [name,setname] = useState('');
    const [password,setpassword] = useState('');
    const [confirmPassword,setconfirmPassword] = useState('');
    const [sccess,setsuccess] = useState('');

    const [error,seterror] = useState('');

    console.log(username,email,name,password,confirmPassword);

    const handleSubmit = async(e) => {
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
                const form = e.target;
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
        <div className="auth-container">
            <div className="auth-box">
                <h1 className='mb-2'>ลงทะเบียน</h1>
                <form onSubmit={handleSubmit}>
                    {error && <p className='text-red-600'>{error}</p>}
                    {sccess && <p className='text-green-600'>{sccess}</p>}
                    <input onChange={(e) => setusername(e.target.value)} className='auth-input' type="text" placeholder='ชื่อผู้ใช้'/>
                    <input onChange={(e) => setemail(e.target.value)} className='auth-input' type="email" placeholder='อีเมล'/>
                    <input onChange={(e) => setname(e.target.value)} className='auth-input' type="text" placeholder='ชื่อ-นามสกุล'/>
                    <input onChange={(e) => setpassword(e.target.value)} className='auth-input' type="password" placeholder='รหัสผ่าน'/>
                    <input onChange={(e) => setconfirmPassword(e.target.value)} className='auth-input' type="password" placeholder='ยืนยันรหัสผ่าน'/>
                    <button type='submit' className='auth-button'>ลงทะเบียน</button>
                </form>
                <p>มีบัญชีแล้ว? <Link href="/auth/login" className='text-green-600'>เข้าสู่ระบบ</Link></p>
            </div>
        </div>
   )
 }
 
 export default RegisterPage
 