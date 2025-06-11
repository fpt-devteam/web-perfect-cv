import toast, { type ToastOptions } from 'react-hot-toast';

export const useToaster = () => ({
    success: (msg: string, opts?: ToastOptions) => toast.success(msg, opts),

    error: (msg: string, opts?: ToastOptions) => toast.error(msg, opts),

    loading: (msg: string, opts?: ToastOptions) => toast.loading(msg, opts),
});
