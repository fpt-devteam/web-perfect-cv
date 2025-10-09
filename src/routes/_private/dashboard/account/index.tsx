import { useState } from 'react';
import { User, Eye } from 'lucide-react';
import clsx from 'clsx';

import AvatarUploader from '../../../../modules/auth/components/AvatarUploader';
import ProfileForm from '../../../../modules/auth/components/ProfileForm';
import ResetPasswordForm from '../../../../modules/auth/components/ResetPasswordForm';

import { createFileRoute } from '@tanstack/react-router';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';

export const Route = createFileRoute('/_private/dashboard/account/')({
  component: ProfilePage,
});

function ProfilePage() {
  const { data: user, refetch } = useGetMe();
  const [selectedTab, setSelectedTab] = useState<'account' | 'password'>('account');
  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 bg-[var(--color-card)] rounded-2xl shadow-lg border border-[var(--color-border)]">
      <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-4 tracking-wide text-center">
        Personal Information
      </h2>

      {/* Credit Information */}
      {(user.totalCredit !== undefined || user.remainingCredit !== undefined || user.usedCredit !== undefined) && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Credit Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.remainingCredit !== undefined && (
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{user.remainingCredit}</p>
                <p className="text-sm text-gray-600">Remaining Credits</p>
              </div>
            )}
            {user.usedCredit !== undefined && (
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{user.usedCredit}</p>
                <p className="text-sm text-gray-600">Used Credits</p>
              </div>
            )}
            {user.totalCredit !== undefined && (
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{user.totalCredit}</p>
                <p className="text-sm text-gray-600">Total Credits</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-row gap-8">
        {/* Sidebar */}
        <div className="flex flex-col bg-[var(--color-sidebar)] rounded-xl p-6 min-w-[200px] space-y-2 border border-[var(--color-sidebar-border)]">
          <button
            className={clsx(
              'flex items-center px-4 py-2 rounded',
              selectedTab === 'account'
                ? 'bg-[var(--color-sidebar-accent)] font-semibold text-[var(--color-sidebar-accent-foreground)]'
                : 'text-[var(--color-sidebar-foreground)] hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-sidebar-accent-foreground)]'
            )}
            onClick={() => setSelectedTab('account')}
          >
            <User className="mr-2" /> Account Information
          </button>
          <button
            className={clsx(
              'flex items-center px-4 py-2 rounded',
              selectedTab === 'password'
                ? 'bg-[var(--color-sidebar-accent)] font-semibold text-[var(--color-sidebar-accent-foreground)]'
                : 'text-[var(--color-sidebar-foreground)] hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-sidebar-accent-foreground)]'
            )}
            onClick={() => setSelectedTab('password')}
          >
            <Eye className="mr-2" /> Password
          </button>
        </div>
        {/* Content */}
        <div className="flex-1">
          {selectedTab === 'account' ? (
            <div className="flex flex-row gap-8 items-start justify-center">
              {/* Avatar Card */}
              <div className="flex flex-col items-center bg-[var(--color-card)] rounded-2xl p-10 min-w-[22rem] max-w-xs border border-[var(--color-border)]">
                <AvatarUploader
                  initialAvatarUrl={user.avatarUrl ?? ''}
                  onUploaded={() => refetch()}
                />
              </div>
              {/* Profile Form Card */}
              <div className="bg-[var(--color-card)] rounded-2xl p-10 border border-[var(--color-border)] min-w-[320px] max-w-2xl">
                <ProfileForm />
              </div>
            </div>
          ) : (
            <ResetPasswordForm />
          )}
        </div>
      </div>
    </div>
  );
}
