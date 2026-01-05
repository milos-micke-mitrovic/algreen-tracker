import { Link } from 'react-router-dom';
import { Home, AlertTriangle, FileQuestion, ShieldX, ServerCrash } from 'lucide-react';

import { Button } from '@/components/ui/button';

/**
 * 404 - Page not found
 */
export function NotFoundView() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="text-center">
        <FileQuestion className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-6 text-6xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Stranica nije pronađena</h2>
        <p className="mt-2 text-muted-foreground">
          Stranica koju tražite ne postoji ili je premeštena.
        </p>
        <Button asChild className="mt-8">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Nazad na početnu
          </Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * 403 - Access forbidden
 */
export function ForbiddenView() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="text-center">
        <ShieldX className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-6 text-6xl font-bold text-primary">403</h1>
        <h2 className="mt-4 text-2xl font-semibold">Pristup odbijen</h2>
        <p className="mt-2 text-muted-foreground">
          Nemate dozvolu za pristup ovoj stranici.
        </p>
        <Button asChild className="mt-8">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Nazad na početnu
          </Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * 500 - Server error
 */
export function ServerErrorView() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="text-center">
        <ServerCrash className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-6 text-6xl font-bold text-primary">500</h1>
        <h2 className="mt-4 text-2xl font-semibold">Greška na serveru</h2>
        <p className="mt-2 text-muted-foreground">
          Došlo je do greške na serveru. Pokušajte ponovo kasnije.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={() => window.location.reload()}>
            Pokušaj ponovo
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Početna
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

interface GenericErrorViewProps {
  message: string;
}

/**
 * Generic error view for unexpected errors
 */
export function GenericErrorView({ message }: GenericErrorViewProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">Došlo je do greške</h1>
        <p className="mt-2 text-muted-foreground">
          Došlo je do neočekivane greške. Molimo pokušajte ponovo.
        </p>
        <pre className="mt-4 overflow-auto rounded-lg bg-muted p-4 text-left text-xs">
          {message}
        </pre>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => window.location.reload()}>
            Pokušaj ponovo
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Početna
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
