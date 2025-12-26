import { Link, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { useScrollDirection } from '@/hooks';
import { cn } from '@/lib/utils';

export function RootLayout() {
  const { scrollDirection, isAtTop } = useScrollDirection();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className={cn(
          'fixed top-0 z-sticky w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300',
          scrollDirection === 'down' && !isAtTop && '-translate-y-full'
        )}
      >
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link to="/" className="mr-6 flex items-center">
              <img src="/logo.png" alt="Algreen Tracker" className="h-8" />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Prijava</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14" />

      {/* Main content */}
      <main className="container py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex h-14 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Built with React + TypeScript
          </p>
        </div>
      </footer>

      <Toaster position="top-right" />
    </div>
  );
}
