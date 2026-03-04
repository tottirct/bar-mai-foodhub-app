'use client'

import React from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import {UtensilsCrossed} from 'lucide-react'

function Navbar() {

  const { data: session, status } = useSession();
  console.log(session);

  if (status === "loading") return <nav className="bg-gray-800 text-white p-4">Loading...</nav>;

  return (
    <nav className="bg-gray-800 text-white p-2">
      <div className="= mx-auto w-full p-0.5">
        <div className="flex justify-between items-center">
            <div className='flex justify-center items-center'>
                <Link href="/" className="flex justify-center bg-green-500 w-8 h-8 rounded-xl shadow-sm shadow-green-500 items-center ">
                  <UtensilsCrossed className="w-6 h-6 text-green-100"/>
                </Link>
                <div className='flex flex-col flex-start px-3'>
                  <div className="text-2xl font-bold leading-none">บาร์ใหม่</div>
                  <div className="text-xs font-thin leading-none">barmai food hub</div>
                </div>
            </div>
            <ul className="flex justify-end">
              {!session ? (
                <>
                  <li className='mx-5'>
                      <Link href="/auth/login">เข้าสู่ระบบ</Link>
                  </li>
                  <li className='mx-5'>
                      <Link href="/auth/register">ลงทะเบียน</Link>
                  </li>
                </>
              ) : (
                <li className='mx-5'>
                    <a onClick={()=>signOut()}>ออกจากระบบ</a>
                </li>
              )}
            </ul>

        </div>
      </div>
    </nav>
  )
}

export default Navbar;
