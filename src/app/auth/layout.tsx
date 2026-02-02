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
        </div> 
      </div>  
    </>
  )};