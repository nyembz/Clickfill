// src/components/AuthForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AuthForm = ({ isRegister = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const endpoint = isRegister ? '/register' : '/login';
    const url = `http://localhost:5000/api/auth${endpoint}`;
    const payload = isRegister ? { email, password, organizationName } : { email, password };

    try {
      const response = await axios.post(url, payload);
      if (isRegister) {
        setMessage('Registration successful! Please log in.');
      } else {
        localStorage.setItem('token', response.data.token);
        setMessage('Login successful! Redirecting...');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <Card className="w-[380px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">{isRegister ? 'Create an Account' : 'Welcome Back'}</CardTitle>
        <CardDescription>{isRegister ? 'Enter your details to get started.' : 'Enter your credentials to access your account.'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            {isRegister && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="organization">Organization Name</Label>
                <Input id="organization" placeholder="Your Company Inc." value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} required />
              </div>
            )}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch">
        <Button onClick={handleSubmit}>{isRegister ? 'Register' : 'Login'}</Button>
        {message && <p className="mt-3 text-sm text-center text-green-600">{message}</p>}
        {error && <p className="mt-3 text-sm text-center text-red-600">{error}</p>}
      </CardFooter>
    </Card>
  );
};
export default AuthForm;