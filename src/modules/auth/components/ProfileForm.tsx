import React, { useState } from 'react';
// import AvatarUploader from './AvatarUploader';
import { useGetMe } from '../hooks/useGetMe';
import type { UserResponse } from '../types/auth.type';
import { updateProfile } from '../services/user.service';

const ProfileForm: React.FC = () => {
  const { data: user, refetch } = useGetMe() as { data: UserResponse; refetch: () => void };
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  // const [avatarFile, setAvatarFile] = useState<File | null>(null);
  // const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user?.avatar);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!user) return <div>Loading...</div>;

  // const handleAvatarSelected = (file: File, previewUrl: string) => {
  //   setAvatarFile(file);
  //   setAvatarPreview(previewUrl);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await updateProfile({ firstName, lastName });
      setSuccess(true);
      refetch();
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="w-full max-w-2xl mx-auto p-8 bg-[var(--color-card)] rounded-2xl shadow border border-[var(--color-border)]"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1">
            First name
          </label>
          <input
            type="text"
            className="w-full border border-[var(--color-input)] rounded-lg px-4 py-3 bg-[var(--color-muted)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder="First name"
            autoComplete="off"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1">
            Last name
          </label>
          <input
            type="text"
            className="w-full border border-[var(--color-input)] rounded-lg px-4 py-3 bg-[var(--color-muted)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            placeholder="Last name"
            autoComplete="off"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-[var(--color-input)] rounded-lg px-4 py-3 bg-[var(--color-muted)] text-[var(--color-muted-foreground)] cursor-not-allowed"
            value={user.email}
            readOnly
            disabled
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-8">
        <button
          type="button"
          className="px-6 py-2 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-foreground)] hover:bg-[var(--color-muted)] font-semibold"
          onClick={() => {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setSuccess(false);
          }}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] font-semibold hover:brightness-110 disabled:opacity-50 transition"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </div>
      {success && (
        <div className="text-[var(--color-primary)] text-sm font-medium mt-4">
          Profile updated successfully!
        </div>
      )}
    </form>
  );
};

export default ProfileForm;
