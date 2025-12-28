import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); 
      navigate('/projects');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div>
          <h1 className="logo-text">ORBIT</h1>
          <h2 style={{textAlign: 'center', margin: 0, fontSize: '20px', fontWeight: 'bold'}}>Welcome Back</h2>
          <p style={{textAlign: 'center', color: '#6b7280', margin: '5px 0 20px 0'}}>Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <div>
            <label style={{fontSize: '14px', fontWeight: '600', marginBottom: '5px', display: 'block'}}>Email Address</label>
            <input 
              required
              type="email" 
              placeholder="name@company.com" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div>
            <label style={{fontSize: '14px', fontWeight: '600', marginBottom: '5px', display: 'block'}}>Password</label>
            <input 
              required
              type="password" 
              placeholder="••••••••" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          <button type="submit" className="btn-primary">Sign In</button>
        </form>

        <Link to="/register" className="link">Don't have an account? Create account</Link>
      </div>
    </div>
  );
};

export default Login;