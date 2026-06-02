import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      login(res.data.token, res.data.username);
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>◈ Bharat Metal Exchange</h1>
          <p>Admin portal — sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Username</label>
            <input
              {...register('username', { required: 'Username is required' })}
              placeholder="admin"
              autoComplete="username"
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <p className="field-error">{errors.username.message}</p>}
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              placeholder="••••••••"
              autoComplete="current-password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign in'}
          </button>
        </form>

        <div className="divider" />
        
      </div>
    </div>
  );
}
