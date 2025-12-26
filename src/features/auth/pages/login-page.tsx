import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input, PasswordInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { showToast } from '@/lib/toast';

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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Login data:', data);
    showToast.success('Uspešna prijava!');
    setIsLoading(false);
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
                errorText={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button type="submit" className="w-full" loading={isLoading}>
              Prijavi se
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Nemate nalog?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Registrujte se
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Algreen. Sva prava zadržana.
      </p>
    </div>
  );
}
