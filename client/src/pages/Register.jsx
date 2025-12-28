import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      navigate('/projects');
    } catch (err) { alert('Registration failed. Email might be taken.'); }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="logo-text">ORBIT</h1>
        <h2 style={{textAlign: 'center', marginBottom: '20px', color: '#555'}}>Create Account</h2>
        <input placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} required />
        <button type="submit" className="btn-primary">Sign Up</button>
        <Link to="/login" className="link">Already have an account? Sign in</Link>
      </form>
    </div>
  );
}