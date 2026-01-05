import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input, PasswordInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateUser } from '../hooks/use-users';
import type { UserRole, Department } from '@/types/domain';

const userSchema = z.object({
  email: z.string().email('Neispravan email'),
  password: z.string().min(8, 'Lozinka mora imati najmanje 8 karaktera'),
  firstName: z.string().min(1, 'Ime je obavezno'),
  lastName: z.string().min(1, 'Prezime je obavezno'),
  role: z.enum(['admin', 'manager', 'supervisor', 'worker']),
  departmentId: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Administrator' },
  { value: 'manager', label: 'Menadžer' },
  { value: 'supervisor', label: 'Supervizor' },
  { value: 'worker', label: 'Radnik' },
];

interface CreateUserSheetProps {
  departments: Department[];
  trigger?: React.ReactNode;
}

export function CreateUserSheet({ departments, trigger }: CreateUserSheetProps) {
  const [open, setOpen] = useState(false);

  const { mutateAsync: createUser, isPending } = useCreateUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'worker',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: UserFormData) => {
    try {
      await createUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        departmentId: data.departmentId,
      });

      setOpen(false);
      reset();
    } catch {
      // Error toast is handled by the mutation hook
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset();
    }
  };

  // Show department selection only for workers and supervisors
  const showDepartment = selectedRole === 'worker' || selectedRole === 'supervisor';

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novi korisnik
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Novi korisnik</SheetTitle>
          <SheetDescription>
            Unesite podatke za novog korisnika sistema.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Ime *</Label>
              <Input
                id="firstName"
                placeholder="Ime"
                {...register('firstName')}
                errorText={errors.firstName?.message}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Prezime *</Label>
              <Input
                id="lastName"
                placeholder="Prezime"
                {...register('lastName')}
                errorText={errors.lastName?.message}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="korisnik@email.com"
              {...register('email')}
              errorText={errors.email?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Lozinka *</Label>
            <PasswordInput
              id="password"
              placeholder="Najmanje 8 karaktera"
              {...register('password')}
              errorText={errors.password?.message}
            />
          </div>

          <div className="space-y-2">
            <Label>Uloga *</Label>
            <Select
              defaultValue="worker"
              onValueChange={(v) => setValue('role', v as UserRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Izaberite ulogu" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showDepartment && (
            <div className="space-y-2">
              <Label>Odeljenje</Label>
              <Select onValueChange={(v) => setValue('departmentId', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Izaberite odeljenje" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <SheetFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Otkaži
            </Button>
            <Button type="submit" loading={isPending}>
              Kreiraj korisnika
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
