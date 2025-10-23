import React, { useState } from 'react';
import { User, Mail, CheckCircle } from 'lucide-react';
import { useGetMe } from '../hooks/useGetMe';
import type { UserResponse } from '../types/auth.type';
import { updateProfile } from '../services/user.service';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

const ProfileForm: React.FC = () => {
  const { data: user, refetch } = useGetMe() as { data: UserResponse; refetch: () => void };
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await updateProfile({ firstName, lastName });
      setSuccess(true);
      refetch();
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      // handle error - could add error state here
    } finally {
      setLoading(false);
    }
  };

  const isFormChanged = firstName !== (user.firstName || '') || lastName !== (user.lastName || '');

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="border-green-300 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-700" />
          <AlertDescription className="text-green-900 font-medium">
            Profile updated successfully!
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={user.email}
            disabled
            className="h-11 bg-muted cursor-not-allowed opacity-60"
          />
          <p className="text-xs text-muted-foreground">
            Email address cannot be changed. Contact support if you need to update your email.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFirstName(user.firstName || '');
              setLastName(user.lastName || '');
              setSuccess(false);
            }}
            disabled={loading || !isFormChanged}
          >
            Reset
          </Button>
          <Button type="submit" disabled={loading || !isFormChanged} className="min-w-[120px]">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
