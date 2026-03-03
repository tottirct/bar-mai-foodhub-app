'use client'

import React from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-2">
      <div className="= mx-auto w-full p-0.5">
        <div className="flex justify-between items-center">
            <div>
                <Link href="/" className="text-3xl font-bold mx-2">บาร์ใหม่</Link>
            </div>
            <ul className="flex justify-end">
                 <li className='mx-5'>
                    <Link href="/auth/login">เข้าสู่ระบบ</Link>
                </li>
                <li className='mx-5'>
                    <Link href="/auth/register">ลงทะเบียน</Link>
                </li>
                <li className='mx-5'>
                    <a onClick={()=>signOut()}>ออกจากระบบ</a>
                </li>
            </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
