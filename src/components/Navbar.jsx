import React from 'react'
import Link from 'next/link'

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-2">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
            <div>
                <Link href="/" className="text-3xl font-bold mx-2">บาร์ใหม่</Link>
            </div>
            <ul className="flex">
                 <li className='mx-5'>
                    <Link href="/auth/login">เข้าสู่ระบบ</Link>
                </li>
                <li className='mx-5'>
                    <Link href="/auth/register">ลงทะเบียน</Link>
                </li>
            </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
