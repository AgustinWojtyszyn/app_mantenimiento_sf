import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import Input from '@/components/Input';
import Alert from '@/components/Alert';
import AuthLayout from '@/components/auth/AuthLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { MailCheck, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, resendVerification } = useAuth();
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const copy = (es, en) => (isEn ? en : es);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) newErrors.fullName = copy('El nombre es requerido', 'Name is required');

    if (!formData.email) newErrors.email = copy('El email es requerido', 'Email is required');
    else if (!emailRegex.test(formData.email)) newErrors.email = copy('Ingresá un email válido', 'Enter a valid email');

    if (!formData.password) newErrors.password = copy('La contraseña es requerida', 'Password is required');
    else if (formData.password.length < 8) newErrors.password = copy('Mínimo 8 caracteres', 'At least 8 characters');

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = copy('Las contraseñas no coinciden', 'Passwords do not match');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setAuthError(null);
    if (!validate()) return;

    setLoading(true);
    const { success: created, error } = await signUp(formData.email, formData.password, formData.fullName);
    setLoading(false);

    if (created) {
      setSuccess(true);
    } else if (error && error.includes('already registered')) {
      setAuthError(copy('Este email ya está registrado. Intentá iniciar sesión.', 'This email is already registered. Try signing in.'));
    } else {
      setAuthError(error || copy('Error al crear la cuenta.', 'Could not create the account.'));
    }
  };

  const handleResend = async () => {
    if (loading) return;
    setLoading(true);
    await resendVerification(formData.email);
    setLoading(false);
  };

  if (success) {
    return (
      <AuthLayout
        icon={MailCheck}
        title={copy('¡Cuenta creada!', 'Account created!')}
        subtitle={copy(
          'Solo falta confirmar tu email para activar el acceso.',
          'Confirm your email to activate access.'
        )}
      >
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100">
          <p className="text-base leading-7">
            {copy('Enviamos la confirmación a ', 'We sent the confirmation to ')}
            <strong>{formData.email}</strong>.
          </p>
          <p className="mt-2 text-sm leading-6 opacity-80">
            {copy('Revisá también la carpeta de spam.', 'Check your spam folder too.')}
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          <Link to="/login" className="block">
            <Button className="h-12 w-full bg-[#082b59] text-base font-bold text-white hover:bg-[#0a376d]">
              {copy('Ir a iniciar sesión', 'Go to sign in')}
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={loading}
            className="h-12 w-full text-base font-bold"
          >
            {loading ? copy('Reenviando...', 'Resending...') : copy('Reenviar confirmación', 'Resend confirmation')}
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title={t('auth.registerTitle')}
      subtitle={t('auth.registerSubtitle')}
    >
      {authError && (
        <div className="mb-6">
          <Alert variant="error" onClose={() => setAuthError(null)}>
            {authError}
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          {
            id: 'fullName',
            label: copy('Nombre completo', 'Full name'),
            placeholder: 'Juan Pérez',
            value: formData.fullName,
            type: 'text',
            error: errors.fullName
          },
          {
            id: 'email',
            label: 'Email',
            placeholder: 'tu@email.com',
            value: formData.email,
            type: 'email',
            error: errors.email
          }
        ].map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + index * 0.08 }}
          >
            <Input
              id={field.id}
              label={field.label}
              type={field.type}
              autoComplete={field.id === 'email' ? 'email' : 'name'}
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              error={field.error}
              className="h-[52px] text-base"
            />
          </motion.div>
        ))}

        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.24 }}>
          <Input
            id="password"
            label={copy('Contraseña', 'Password')}
            type="password"
            autoComplete="new-password"
            placeholder={copy('Mínimo 8 caracteres', 'At least 8 characters')}
            hint={copy('Usá al menos 8 caracteres.', 'Use at least 8 characters.')}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            showPasswordToggle
            className="h-[52px] text-base"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.32 }}>
          <Input
            id="confirmPassword"
            label={copy('Confirmar contraseña', 'Confirm password')}
            type="password"
            autoComplete="new-password"
            placeholder={copy('Repetí tu contraseña', 'Repeat your password')}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            showPasswordToggle
            className="h-[52px] text-base"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-[#082b59] text-base font-bold text-white shadow-lg shadow-blue-950/10 hover:bg-[#0a376d]"
          >
            {loading ? copy('Creando cuenta...', 'Creating account...') : copy('Crear cuenta', 'Create account')}
          </Button>
        </motion.div>
      </form>

      <div className="mt-8 border-t border-slate-100 pt-6 text-center text-base dark:border-slate-800">
        <span className="text-slate-600 dark:text-slate-300">{t('auth.yesAccount')} </span>
        <Link
          to="/login"
          className="font-bold text-[#1e3a8a] transition-colors hover:text-blue-700 hover:underline dark:text-blue-200 dark:hover:text-blue-100"
        >
          {t('auth.loginCta')}
        </Link>
      </div>
    </AuthLayout>
  );
}
