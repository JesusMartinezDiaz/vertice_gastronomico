/**
 * Página de Login - Vértice Gastronómico
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export function LoginPage() {
  const { login, register, loading, error } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        setFormError('Las contraseñas no coinciden');
        return;
      }
      if (formData.password.length < 6) {
        setFormError('La contraseña debe tener al menos 6 caracteres');
        return;
      }
      const result = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name
      });
      if (!result.success) {
        setFormError(result.error);
      }
    } else {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setFormError(result.error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setFormError('');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">V</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Vértice Gastronómico</h1>
          <p className="text-gray-400 mt-2">
            {isRegister ? 'Crea tu cuenta' : 'Inicia sesión para continuar'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <Input
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                required
              />
            )}

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            {isRegister && (
              <Input
                label="Confirmar Contraseña"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            )}

            {(formError || error) && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {formError || error}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              loading={loading}
              className="mt-6"
            >
              {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setFormError('');
              }}
              className="text-emerald-400 hover:text-emerald-300 text-sm"
            >
              {isRegister
                ? '¿Ya tienes cuenta? Inicia sesión'
                : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Sistema de gestión para restaurantes
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
