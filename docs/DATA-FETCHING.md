# Data Fetching Guide

This project uses **Axios** for API calls with custom hooks for state management.

## API Client Setup

The API client is already configured in `src/services/api.ts`:
- Base URL from environment variable
- Auto-attaches auth token to requests
- Handles 401 errors (redirects to login)

---

## Basic Usage

### Import the helpers

```tsx
import { get, post, put, del } from '@/services/api';
```

### Simple GET request

```tsx
const users = await get<User[]>('/users');
```

### POST request

```tsx
const newUser = await post<User>('/users', {
  name: 'John',
  email: 'john@example.com',
});
```

### PUT request

```tsx
const updated = await put<User>(`/users/${id}`, {
  name: 'John Updated',
});
```

### DELETE request

```tsx
await del(`/users/${id}`);
```

---

## Using the useApi Hook

For fetching data in components, use the `useApi` hook:

```tsx
import { useApi } from '@/hooks/use-api';
import { get } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

export function UsersList() {
  const { data: users, isLoading, error } = useApi(() =>
    get<User[]>('/users')
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-destructive">Error: {error}</div>;
  }

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## Manual Fetching

Sometimes you want to fetch on button click, not on mount:

```tsx
import { useApi } from '@/hooks/use-api';
import { get } from '@/services/api';

export function SearchUsers() {
  const [query, setQuery] = useState('');

  const { data, isLoading, execute } = useApi(
    () => get<User[]>(`/users?search=${query}`),
    { immediate: false } // Don't fetch on mount
  );

  const handleSearch = () => {
    execute(); // Fetch manually
  };

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>

      {data?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

---

## Mutations (POST, PUT, DELETE)

Use the `useMutation` hook for create, update, delete operations:

```tsx
import { useMutation } from '@/hooks/use-api';
import { post } from '@/services/api';

interface CreateUserDto {
  name: string;
  email: string;
}

export function CreateUserForm() {
  const { mutate, isLoading, error } = useMutation((data: CreateUserDto) =>
    post<User>('/users', data)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await mutate({ name: 'John', email: 'john@example.com' });

    if (result) {
      console.log('User created:', result);
      // Redirect or show success
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-destructive">{error}</div>}
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

---

## Creating Feature-Specific API Functions

For each feature, create an API file:

```tsx
// src/features/users/services/users-api.ts

import { get, post, put, del } from '@/services/api';
import type { User, CreateUserDto, UpdateUserDto } from '../types/user.types';

export const usersApi = {
  getAll: () => get<User[]>('/users'),

  getById: (id: string) => get<User>(`/users/${id}`),

  create: (data: CreateUserDto) => post<User>('/users', data),

  update: (id: string, data: UpdateUserDto) => put<User>(`/users/${id}`, data),

  delete: (id: string) => del(`/users/${id}`),

  search: (query: string) => get<User[]>(`/users?search=${query}`),
};
```

---

## Creating Feature-Specific Hooks

Then create hooks that use these API functions:

```tsx
// src/features/users/hooks/use-users.ts

import { useApi, useMutation } from '@/hooks/use-api';
import { usersApi } from '../services/users-api';
import type { CreateUserDto, UpdateUserDto } from '../types/user.types';

// Fetch all users
export function useUsers() {
  return useApi(() => usersApi.getAll());
}

// Fetch single user
export function useUser(id: string) {
  return useApi(() => usersApi.getById(id));
}

// Create user
export function useCreateUser() {
  return useMutation((data: CreateUserDto) => usersApi.create(data));
}

// Update user
export function useUpdateUser(id: string) {
  return useMutation((data: UpdateUserDto) => usersApi.update(id, data));
}

// Delete user
export function useDeleteUser() {
  return useMutation((id: string) => usersApi.delete(id));
}
```

---

## Complete Example: Users Feature

### Types

```tsx
// src/features/users/types/user.types.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: 'admin' | 'user';
}
```

### API

```tsx
// src/features/users/services/users-api.ts

import { get, post, put, del } from '@/services/api';
import type { User, CreateUserDto, UpdateUserDto } from '../types/user.types';

export const usersApi = {
  getAll: () => get<User[]>('/users'),
  getById: (id: string) => get<User>(`/users/${id}`),
  create: (data: CreateUserDto) => post<User>('/users', data),
  update: (id: string, data: UpdateUserDto) => put<User>(`/users/${id}`, data),
  delete: (id: string) => del(`/users/${id}`),
};
```

### Hooks

```tsx
// src/features/users/hooks/use-users.ts

import { useApi, useMutation } from '@/hooks/use-api';
import { usersApi } from '../services/users-api';

export function useUsers() {
  return useApi(() => usersApi.getAll());
}

export function useDeleteUser() {
  return useMutation((id: string) => usersApi.delete(id));
}
```

### Page

```tsx
// src/features/users/pages/users-page.tsx

import { useUsers, useDeleteUser } from '../hooks/use-users';

export function UsersPage() {
  const { data: users, isLoading, error, execute: refetch } = useUsers();
  const { mutate: deleteUser, isLoading: isDeleting } = useDeleteUser();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await deleteUser(id);
      refetch(); // Refresh the list
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>

      <div className="space-y-2">
        {users?.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 border rounded">
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
            <button
              onClick={() => handleDelete(user.id)}
              disabled={isDeleting}
              className="text-destructive hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Error Handling

Errors are automatically caught and stored in the `error` state:

```tsx
const { data, error, isLoading } = useApi(() => get('/users'));

if (error) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
```

---

## With Query Parameters

```tsx
// Build query string
const params = new URLSearchParams({
  page: '1',
  limit: '10',
  search: 'john',
});

const users = await get<User[]>(`/users?${params}`);
```

Or use axios config:

```tsx
import { api } from '@/services/api';

const response = await api.get<User[]>('/users', {
  params: {
    page: 1,
    limit: 10,
    search: 'john',
  },
});
```
