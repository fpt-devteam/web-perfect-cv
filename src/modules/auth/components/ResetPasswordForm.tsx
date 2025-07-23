import React, { useState } from 'react';

const ResetPasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    // TODO: integrate password update API
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <form
      className="max-w-2xl mx-auto p-8 bg-[var(--color-card)] rounded-2xl shadow-lg border border-[var(--color-border)]"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-4 tracking-wide">
        Change Password
      </h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">
            Current Password
          </label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="Current password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">
            New Password
          </label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="New password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-8">
        <button
          type="button"
          className="px-4 py-2 rounded border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] hover:bg-[var(--color-sidebar-accent)]"
          onClick={() => {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setSuccess(false);
          }}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-[var(--color-primary)] text-[var(--color-primary-foreground)] font-semibold hover:opacity-90"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </div>
      {success && (
        <div className="text-green-600 text-sm font-medium mt-4">
          Password updated successfully!
        </div>
      )}
    </form>
  );
};

export default ResetPasswordForm;
