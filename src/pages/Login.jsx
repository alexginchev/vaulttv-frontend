import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login(username, password);
      loginUser(res.data.token, res.data.username, res.data.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data || 'Login failed.');
    }
  };

  return (
    <div className="auth-page">
      <h1>Sign in to VaultTV</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{String(error)}</p>}
        <button type="submit">Sign In</button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}

export default Login;