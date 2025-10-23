import { useState } from 'react';
import { User, Settings, CreditCard, Trophy, Star, ArrowRight, Shield } from 'lucide-react';

import AvatarUploader from '../../../../modules/auth/components/AvatarUploader';
import ProfileForm from '../../../../modules/auth/components/ProfileForm';
import ResetPasswordForm from '../../../../modules/auth/components/ResetPasswordForm';

import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useGetMe } from '@/modules/auth/hooks/useGetMe';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

export const Route = createFileRoute('/_private/dashboard/account/')({
  component: ProfilePage,
});

function ProfilePage() {
  const { data: user, refetch } = useGetMe();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'account' | 'password'>('account');

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasCredits =
    user.totalCredit !== undefined ||
    user.remainingCredit !== undefined ||
    user.usedCredit !== undefined;
  const memberSince = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="py-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Account Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your profile information, security settings, and billing details
          </p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="text-lg font-semibold">{memberSince}</p>
              </div>
              <Trophy className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        {hasCredits && (
          <>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining Credits</p>
                    <p className="text-lg font-semibold text-green-600">
                      {user.remainingCredit || 0}
                    </p>
                  </div>
                  <CreditCard className="h-6 w-6 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Used Credits</p>
                    <p className="text-lg font-semibold text-orange-600">{user.usedCredit || 0}</p>
                  </div>
                  <Star className="h-6 w-6 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Credits</p>
                    <p className="text-lg font-semibold text-blue-600">{user.totalCredit || 0}</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    All Time
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!hasCredits && (
          <Card className="border-l-4 border-l-gray-300 col-span-1 md:col-span-2 lg:col-span-3">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Account Plan</p>
                  <p className="text-lg font-semibold">Free Plan</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate({ to: '/dashboard/pricing' })}
                  className="flex items-center gap-2"
                >
                  Upgrade <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AvatarUploader initialAvatarUrl={user.avatarUrl ?? ''} onUploaded={() => refetch()} />
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.email?.split('@')[0] || 'User'}
              </h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="text-xs">
                {hasCredits ? 'Premium User' : 'Free User'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setSelectedTab('account')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors flex-1 justify-center ${
                selectedTab === 'account'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Settings className="h-4 w-4" />
              Personal Information
            </button>
            <button
              onClick={() => setSelectedTab('password')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors flex-1 justify-center ${
                selectedTab === 'password'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Shield className="h-4 w-4" />
              Security
            </button>
          </div>

          {/* Tab Content */}
          {selectedTab === 'account' && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          )}

          {selectedTab === 'password' && (
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <ResetPasswordForm />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
