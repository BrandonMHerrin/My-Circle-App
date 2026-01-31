import * as React from "react";
import { type Metadata } from 'next';
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: 'Login - My Circle',
  description: 'Authenticate to access your My Circle account and build meaningful circles.'
}

export default function LoginPage() {
    return <LoginForm />;
}