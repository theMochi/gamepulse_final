'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Settings, User, Mail, FileText, Image as ImageIcon, Lock, Check, AlertCircle } from 'lucide-react';

function SettingsPageContent() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    image: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (session?.user) {
      setFormData({
        username: session.user.name || '',
        email: session.user.email || '',
        bio: '',
        image: session.user.image || '',
        password: '',
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'An error occurred');
        return;
      }

      setSuccess('Profile updated successfully');
      await update(); // Refresh session
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and profile</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              rows={4}
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label htmlFor="image" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              Avatar URL
            </label>
            <input
              type="url"
              name="image"
              id="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              New Password
              <span className="text-muted-foreground font-normal">(leave blank to keep current)</span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-3">
            <Check className="h-4 w-4" />
            {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all"
        >
          {loading ? (
            'Updating...'
          ) : (
            <>
              <Check className="h-4 w-4" />
              Update Profile
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default dynamic(() => Promise.resolve(SettingsPageContent), {
  ssr: false,
});
