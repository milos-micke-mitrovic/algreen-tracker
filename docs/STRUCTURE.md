# Project Structure Guide

This document explains where to put your code.

## Folder Overview

```
src/
├── components/          # Shared components used across features
│   └── ui/             # shadcn/ui components (DO NOT EDIT)
├── config/             # App configuration
├── features/           # YOUR WORK GOES HERE
│   └── [feature-name]/
│       ├── components/ # Components for this feature
│       ├── hooks/      # Hooks for this feature
│       ├── pages/      # Pages for this feature
│       ├── services/   # API calls for this feature
│       ├── stores/     # State management for this feature
│       └── types/      # TypeScript types for this feature
├── hooks/              # Shared hooks (useDebounce, etc.)
├── layouts/            # Page layouts (header, footer, sidebar)
├── lib/                # Utility functions (formatDate, cn, etc.)
├── routes/             # Route definitions
├── services/           # Shared API services
├── stores/             # Global state (Zustand)
└── types/              # Shared TypeScript types
```

---

## Where to Put Your Code

### Creating a new feature

If you're building a "Users" feature:

```
src/features/users/
├── components/
│   ├── user-card.tsx
│   └── user-list.tsx
├── hooks/
│   └── use-users.ts
├── pages/
│   └── users-page.tsx
├── services/
│   └── users-api.ts
└── types/
    └── user.types.ts
```

### Adding a new page

1. Create the page in your feature folder:
   ```
   src/features/users/pages/users-page.tsx
   ```

2. Add the route in `src/routes/index.tsx`:
   ```typescript
   import { UsersPage } from '@/features/users/pages/users-page';

   // Add to children array:
   {
     path: 'users',
     element: <UsersPage />,
   },
   ```

### Adding a shared component

If multiple features need the same component, put it in:
```
src/components/data-table.tsx
src/components/search-input.tsx
```

### Adding a shared hook

If multiple features need the same hook, put it in:
```
src/hooks/use-pagination.ts
```

---

## File Naming

| Type | Naming | Example |
|------|--------|---------|
| Components | kebab-case | `user-card.tsx` |
| Pages | kebab-case + `-page` | `users-page.tsx` |
| Hooks | kebab-case + `use-` | `use-users.ts` |
| Services | kebab-case + `-api` | `users-api.ts` |
| Types | kebab-case + `.types` | `user.types.ts` |
| Stores | kebab-case + `-store` | `user-store.ts` |

---

## Example: Creating "Products" Feature

### Step 1: Create folders

```bash
mkdir -p src/features/products/{components,hooks,pages,services,types}
```

### Step 2: Create types

```typescript
// src/features/products/types/product.types.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}
```

### Step 3: Create API service

```typescript
// src/features/products/services/products-api.ts

import { api } from '@/services/api';
import type { Product } from '../types/product.types';

export const productsApi = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  create: (data: Omit<Product, 'id'>) => api.post<Product>('/products', data),
};
```

### Step 4: Create hook

```typescript
// src/features/products/hooks/use-products.ts

import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../services/products-api';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
  });
}
```

### Step 5: Create component

```typescript
// src/features/products/components/product-card.tsx

import type { Product } from '../types/product.types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-muted-foreground">${product.price}</p>
    </div>
  );
}
```

### Step 6: Create page

```typescript
// src/features/products/pages/products-page.tsx

import { useProducts } from '../hooks/use-products';
import { ProductCard } from '../components/product-card';

export function ProductsPage() {
  const { data: products, isLoading } = useProducts();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Products</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### Step 7: Add route

```typescript
// src/routes/index.tsx

import { ProductsPage } from '@/features/products/pages/products-page';

// Add to children:
{
  path: 'products',
  element: <ProductsPage />,
},
```

---

## Don'ts

❌ Don't create files outside of the structure above
❌ Don't edit files in `src/components/ui/` (managed by shadcn)
❌ Don't put feature-specific code in shared folders
❌ Don't use PascalCase for file names (use kebab-case)
