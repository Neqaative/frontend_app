import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { authService } from '../services/api';
import type { SignUpDto } from '../types';
import { FORM_LABELS } from '../constants/formLabels';
import '../styles/LoginPage.css';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/dashboard');
      } else {
        // Walidacja hasła
        if (password !== confirmPassword) {
          setError('Hasła nie są identyczne');
          setLoading(false);
          return;
        }
        
        if (password.length < 8) {
          setError('Hasło musi mieć co najmniej 8 znaków');
          setLoading(false);
          return;
        }

        const signupDto: SignUpDto = { 
          first_name: firstName, 
          last_name: lastName, 
          email, 
          password 
        };
        await authService.signup(signupDto);
        setIsLogin(true);
        setError('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setConfirmPassword('');
        toast.success('Konto utworzone! Możesz się teraz zalogować.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Wystąpił błąd');
      toast.error(err.response?.data?.message || 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{isLogin ? 'Zaloguj się' : 'Utwórz konto'}</h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <>
              <div className="login-form-group">
                <label>{FORM_LABELS.firstName}</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="login-input"
                  placeholder="Wprowadź imię"
                />
              </div>
              
              <div className="login-form-group">
                <label>{FORM_LABELS.lastName}</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="login-input"
                  placeholder="Wprowadź nazwisko"
                />
              </div>
            </>
          )}
          
          <div className="login-form-group">
            <label>{FORM_LABELS.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
              placeholder="Wprowadź email"
            />
          </div>
          
          <div className="login-form-group">
            <label>{FORM_LABELS.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
              placeholder="Wprowadź hasło"
            />
          </div>

          {!isLogin && (
            <div className="login-form-group">
              <label>{FORM_LABELS.confirmPassword}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="login-input"
                placeholder="Wprowadź hasło ponownie"
              />
            </div>
          )}

          {error && <div className="login-error">{error}</div>}
          
          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Ładowanie...' : isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
          </button>
        </form>
        
        <p className="login-toggle-text">
          {isLogin ? "Nie masz konta? " : 'Masz już konto? '}
          <span onClick={() => setIsLogin(!isLogin)} className="login-link">
            {isLogin ? 'Zarejestruj się' : 'Zaloguj się'}
          </span>
        </p>
      </div>
    </div>
  );
};
