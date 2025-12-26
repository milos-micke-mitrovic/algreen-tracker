import { toast } from 'sonner';

/**
 * Toast helpers with Serbian defaults
 */
export const showToast = {
  success: (message: string) => {
    toast.success(message);
  },

  error: (message: string) => {
    toast.error(message);
  },

  info: (message: string) => {
    toast.info(message);
  },

  warning: (message: string) => {
    toast.warning(message);
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },

  // Common Serbian messages
  saved: () => toast.success('Uspešno sačuvano'),
  deleted: () => toast.success('Uspešno obrisano'),
  updated: () => toast.success('Uspešno ažurirano'),
  created: () => toast.success('Uspešno kreirano'),
  errorGeneric: () => toast.error('Došlo je do greške. Pokušajte ponovo.'),
  errorNetwork: () => toast.error('Greška u mreži. Proverite internet konekciju.'),
  errorNotFound: () => toast.error('Traženi resurs nije pronađen.'),
  errorUnauthorized: () => toast.error('Nemate dozvolu za ovu akciju.'),
};

// Re-export raw toast for custom usage
export { toast };
