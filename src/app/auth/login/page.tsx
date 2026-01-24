import * as React from "react";
import { type Metadata } from 'next';
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: 'Login - My Circle',
}

export default function LoginPage() {
    return <LoginForm />;
}