import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import {
  NotFoundView,
  ForbiddenView,
  ServerErrorView,
  GenericErrorView,
} from './error-views';

const meta: Meta = {
  title: 'Components/ErrorViews',
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;

export const NotFound: StoryObj<typeof NotFoundView> = {
  render: () => <NotFoundView />,
  parameters: {
    docs: {
      description: {
        story: '404 - Stranica nije pronađena. Prikazuje se kada korisnik poseti nepostojeću stranicu.',
      },
    },
  },
};

export const Forbidden: StoryObj<typeof ForbiddenView> = {
  render: () => <ForbiddenView />,
  parameters: {
    docs: {
      description: {
        story: '403 - Pristup odbijen. Prikazuje se kada korisnik nema dozvolu za pristup stranici.',
      },
    },
  },
};

export const ServerError: StoryObj<typeof ServerErrorView> = {
  render: () => <ServerErrorView />,
  parameters: {
    docs: {
      description: {
        story: '500 - Greška na serveru. Prikazuje se kada dođe do greške na serveru.',
      },
    },
  },
};

export const GenericError: StoryObj<typeof GenericErrorView> = {
  render: () => <GenericErrorView message="TypeError: Cannot read properties of undefined (reading 'map')" />,
  parameters: {
    docs: {
      description: {
        story: 'Generička greška. Prikazuje se za neočekivane JavaScript greške.',
      },
    },
  },
};

export const GenericErrorLongMessage: StoryObj<typeof GenericErrorView> = {
  render: () => (
    <GenericErrorView
      message={`Error: Something went wrong in the application.
Stack trace:
  at UserProfile (src/features/users/components/user-profile.tsx:42:15)
  at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:14985:18)
  at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:17811:13)`}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Generička greška sa dugačkom porukom/stack trace-om.',
      },
    },
  },
};

export const AllErrorViews: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div className="border-b pb-8">
        <h2 className="mb-4 text-center text-lg font-semibold">404 - Not Found</h2>
        <div className="h-[400px] overflow-hidden rounded-lg border">
          <NotFoundView />
        </div>
      </div>
      <div className="border-b pb-8">
        <h2 className="mb-4 text-center text-lg font-semibold">403 - Forbidden</h2>
        <div className="h-[400px] overflow-hidden rounded-lg border">
          <ForbiddenView />
        </div>
      </div>
      <div className="border-b pb-8">
        <h2 className="mb-4 text-center text-lg font-semibold">500 - Server Error</h2>
        <div className="h-[400px] overflow-hidden rounded-lg border">
          <ServerErrorView />
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-center text-lg font-semibold">Generic Error</h2>
        <div className="h-[400px] overflow-hidden rounded-lg border">
          <GenericErrorView message="Neočekivana greška u aplikaciji" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
