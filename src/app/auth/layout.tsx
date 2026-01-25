import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import React, { Children } from 'react';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - My Circle',
  description: 'Authenticate to access your My Circle account and build meaningful circles.'
}

export default function Layout ({children}: {children: React.ReactNode}) {
  return(
    <>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-300">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              {children}
              <hr className='mt-4'></hr>
              
              <div className="mt-3 text-left text-gray-700 w-full flex flex-col gap-2">
                <button className="border border-solid border-gray-300 rounded-md shadow-sm p-2 w-full text-center hover:bg-gray-100">
                  <FcGoogle className='inline text-2xl w-auto '/> Google
                </button>
                <Link href="/login/github" className="border border-solid border-gray-300 rounded-md shadow-sm p-2 w-full text-center hover:bg-gray-100">
                  <FaGithub className='inline text-2xl w-auto '/> GitHub
                </Link>
            </div>
        </div> 
      </div>  
    </>
  )};