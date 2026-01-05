import { useState } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Key,
  Pencil,
  Trash2,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { useUsers, useToggleUserStatus, useDeleteUser, useResetUserPassword } from '../hooks/use-users';
import { useDepartments } from '@/features/production/hooks/use-production-cards';
import { CreateUserSheet } from '../components/create-user-sheet';
import type { UserRole } from '@/types/domain';
import type { UserWithDepartment } from '../types/user.types';

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrator',
  manager: 'Menadžer',
  supervisor: 'Supervizor',
  worker: 'Radnik',
};

const roleColors: Record<UserRole, string> = {
  admin: 'bg-primary/10 text-primary',
  manager: 'bg-info/10 text-info',
  supervisor: 'bg-warning/10 text-warning',
  worker: 'bg-muted text-muted-foreground',
};

/**
 * User management page
 */
export function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [userToDelete, setUserToDelete] = useState<UserWithDepartment | null>(null);
  const [userToResetPassword, setUserToResetPassword] = useState<UserWithDepartment | null>(null);

  const { data: users, isLoading } = useUsers();
  const { data: departments } = useDepartments();
  const { mutate: toggleStatus } = useToggleUserStatus();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: resetPassword, isPending: isResetting } = useResetUserPassword();

  // Filter users
  const filteredUsers = users?.filter((user) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        user.email.toLowerCase().includes(query) ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Role filter
    if (roleFilter !== 'all' && user.role !== roleFilter) {
      return false;
    }

    // Department filter
    if (departmentFilter !== 'all' && user.departmentId !== departmentFilter) {
      return false;
    }

    // Status filter
    if (statusFilter === 'active' && !user.isActive) return false;
    if (statusFilter === 'inactive' && user.isActive) return false;

    return true;
  });

  const handleDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  const handleResetPassword = () => {
    if (userToResetPassword) {
      resetPassword(userToResetPassword.id);
      setUserToResetPassword(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Korisnici</h1>
          <p className="text-muted-foreground">Upravljanje korisnicima sistema</p>
        </div>
        <CreateUserSheet departments={departments || []} />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filteri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <Input
              placeholder="Pretraži..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startIcon={<Search className="h-4 w-4" />}
            />

            {/* Role filter */}
            <Select
              value={roleFilter}
              onValueChange={(v) => setRoleFilter(v as UserRole | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Uloga" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Sve uloge</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Menadžer</SelectItem>
                <SelectItem value="supervisor">Supervizor</SelectItem>
                <SelectItem value="worker">Radnik</SelectItem>
              </SelectContent>
            </Select>

            {/* Department filter */}
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Odeljenje" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Sva odeljenja</SelectItem>
                {departments?.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status filter */}
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as 'all' | 'active' | 'inactive')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Svi statusi</SelectItem>
                <SelectItem value="active">Aktivni</SelectItem>
                <SelectItem value="inactive">Neaktivni</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : filteredUsers && filteredUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Korisnik</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Uloga</TableHead>
                  <TableHead>Odeljenje</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onToggleStatus={(activate) => toggleStatus({ userId: user.id, activate })}
                    onDelete={() => setUserToDelete(user)}
                    onResetPassword={() => setUserToResetPassword(user)}
                  />
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              Nema korisnika za prikaz
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Obriši korisnika?</AlertDialogTitle>
            <AlertDialogDescription>
              Da li ste sigurni da želite da obrišete korisnika{' '}
              <strong>
                {userToDelete?.firstName} {userToDelete?.lastName}
              </strong>
              ? Ova akcija se ne može poništiti.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Otkaži</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Brisanje...' : 'Obriši'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Confirmation Dialog */}
      <AlertDialog open={!!userToResetPassword} onOpenChange={() => setUserToResetPassword(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resetuj lozinku?</AlertDialogTitle>
            <AlertDialogDescription>
              Da li ste sigurni da želite da resetujete lozinku za korisnika{' '}
              <strong>
                {userToResetPassword?.firstName} {userToResetPassword?.lastName}
              </strong>
              ? Nova privremena lozinka će biti generisana.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Otkaži</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword} disabled={isResetting}>
              {isResetting ? 'Resetovanje...' : 'Resetuj lozinku'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function UserRow({
  user,
  onToggleStatus,
  onDelete,
  onResetPassword,
}: {
  user: UserWithDepartment;
  onToggleStatus: (activate: boolean) => void;
  onDelete: () => void;
  onResetPassword: () => void;
}) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <TableRow className={cn(!user.isActive && 'opacity-60')}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge className={roleColors[user.role]} variant="outline">
          {roleLabels[user.role]}
        </Badge>
      </TableCell>
      <TableCell>{user.department?.name || '-'}</TableCell>
      <TableCell>
        <Badge
          className={
            user.isActive
              ? 'bg-success/10 text-success'
              : 'bg-muted text-muted-foreground'
          }
          variant="outline"
        >
          {user.isActive ? 'Aktivan' : 'Neaktivan'}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Izmeni
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onResetPassword}>
              <Key className="mr-2 h-4 w-4" />
              Resetuj lozinku
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user.isActive ? (
              <DropdownMenuItem onClick={() => onToggleStatus(false)}>
                <UserX className="mr-2 h-4 w-4" />
                Deaktiviraj
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onToggleStatus(true)}>
                <UserCheck className="mr-2 h-4 w-4" />
                Aktiviraj
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Obriši
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
