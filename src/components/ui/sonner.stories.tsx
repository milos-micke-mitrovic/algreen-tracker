import type { Meta, StoryObj } from '@storybook/react';
import { toast } from 'sonner';

import { Button } from './button';
import { Toaster } from './sonner';

const meta: Meta<typeof Toaster> = {
  title: 'UI/Toaster',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    return (
      <Button onClick={() => toast('Ovo je obaveštenje')}>
        Prikaži obaveštenje
      </Button>
    );
  },
};

export const Success: Story = {
  render: function Render() {
    return (
      <Button
        variant="default"
        onClick={() => toast.success('Operacija uspešno završena!')}
      >
        Prikaži uspeh
      </Button>
    );
  },
};

export const ErrorToast: Story = {
  render: function Render() {
    return (
      <Button
        variant="destructive"
        onClick={() => toast.error('Došlo je do greške. Pokušajte ponovo.')}
      >
        Prikaži grešku
      </Button>
    );
  },
};

export const Warning: Story = {
  render: function Render() {
    return (
      <Button
        variant="outline"
        onClick={() => toast.warning('Upozorenje: Ova akcija se ne može poništiti.')}
      >
        Prikaži upozorenje
      </Button>
    );
  },
};

export const Info: Story = {
  render: function Render() {
    return (
      <Button
        variant="secondary"
        onClick={() => toast.info('Nova verzija aplikacije je dostupna.')}
      >
        Prikaži info
      </Button>
    );
  },
};

export const Loading: Story = {
  render: function Render() {
    const handleClick = () => {
      const toastId = toast.loading('Učitavanje...');
      setTimeout(() => {
        toast.success('Učitavanje završeno!', { id: toastId });
      }, 2000);
    };

    return (
      <Button variant="outline" onClick={handleClick}>
        Prikaži učitavanje
      </Button>
    );
  },
};

export const WithDescription: Story = {
  render: function Render() {
    return (
      <Button
        onClick={() =>
          toast.success('Korisnik sačuvan', {
            description: 'Podaci korisnika su uspešno ažurirani u bazi.',
          })
        }
      >
        Sa opisom
      </Button>
    );
  },
};

export const WithAction: Story = {
  render: function Render() {
    return (
      <Button
        onClick={() =>
          toast('Dokument obrisan', {
            action: {
              label: 'Poništi',
              onClick: () => toast.success('Brisanje poništeno'),
            },
          })
        }
      >
        Sa akcijom
      </Button>
    );
  },
};

export const WithCancel: Story = {
  render: function Render() {
    return (
      <Button
        onClick={() =>
          toast('Da li želite da nastavite?', {
            action: {
              label: 'Da',
              onClick: () => toast.success('Nastavljeno'),
            },
            cancel: {
              label: 'Ne',
              onClick: () => toast.error('Otkazano'),
            },
          })
        }
      >
        Sa potvrdom
      </Button>
    );
  },
};

export const PromiseToast: Story = {
  render: function Render() {
    const handleClick = () => {
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            resolve('Uspešno!');
          } else {
            reject('Neuspešno!');
          }
        }, 2000);
      });

      toast.promise(promise, {
        loading: 'Čuvanje podataka...',
        success: 'Podaci sačuvani!',
        error: 'Greška pri čuvanju podataka.',
      });
    };

    return (
      <Button onClick={handleClick}>
        Promise toast (50% šansa za grešku)
      </Button>
    );
  },
};

export const AllTypes: Story = {
  render: function Render() {
    return (
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toast('Obaveštenje')}>Default</Button>
        <Button onClick={() => toast.success('Uspeh!')}>Uspeh</Button>
        <Button onClick={() => toast.error('Greška!')}>Greška</Button>
        <Button onClick={() => toast.warning('Upozorenje!')}>Upozorenje</Button>
        <Button onClick={() => toast.info('Info!')}>Info</Button>
        <Button onClick={() => toast.loading('Učitavanje...')}>Loading</Button>
      </div>
    );
  },
};
