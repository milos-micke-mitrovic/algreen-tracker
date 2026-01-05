import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, KeyRound, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input, PasswordInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { showToast } from '@/lib/toast';
import { useAuthStore } from '@/stores/auth-store';
import { authApi } from '../services/auth-api';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email je obavezan')
    .email('Unesite validnu email adresu'),
  password: z
    .string()
    .min(1, 'Lozinka je obavezna')
    .min(8, 'Lozinka mora imati najmanje 8 karaktera'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'worker') {
        navigate('/tablet', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Get redirect location from state (set by RequireAuth)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(data);
      showToast.success('Uspešna prijava!');

      // Navigate based on role (workers always go to tablet)
      if (response.user.role === 'worker') {
        navigate('/tablet', { replace: true });
      } else if (from && !from.startsWith('/tablet')) {
        // Non-workers can go to their intended page (unless it was tablet)
        navigate(from, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Greška pri prijavi';
      setError(message);
      showToast.error('Prijava nije uspela');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      {/* Logo */}
      <Link to="/" className="mb-8">
        <img src="/logo.png" alt="Algreen Tracker" className="h-12" />
      </Link>

      {/* Login Card */}
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Dobrodošli nazad</CardTitle>
          <CardDescription>
            Unesite vaše podatke za prijavu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vas@email.com"
                startIcon={<Mail className="h-4 w-4" />}
                errorText={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Lozinka</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Zaboravili ste lozinku?
                </Link>
              </div>
              <PasswordInput
                id="password"
                placeholder="Unesite lozinku"
                startIcon={<KeyRound className="h-4 w-4" />}
                errorText={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button type="submit" className="w-full" loading={isLoading}>
              Prijavi se
            </Button>
          </form>

        </CardContent>
      </Card>

      {/* Mock credentials info */}
      <Card className="mt-4 w-full max-w-md border-info/50 bg-info/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-info mb-2">Test nalozi:</p>
              <div className="space-y-1 text-muted-foreground">
                <p><strong>Admin:</strong> admin@algreen.rs / admin123</p>
                <p><strong>Menadžer:</strong> manager@algreen.rs / manager123</p>
                <p><strong>Radnik:</strong> petar.ilic@algreen.rs / radnik123</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-muted-foreground">
        &copy; 2026 Algreen. Sva prava zadržana.
      </p>
    </div>
  );
}
