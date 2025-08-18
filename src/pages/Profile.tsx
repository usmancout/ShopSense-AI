import React, { useEffect, useState } from 'react';
import { User, Mail, Lock, Camera, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from "axios";

const Profile: React.FC = () => {
  const { user, updateProfile, getProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch profile when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await getProfile();
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, [getProfile]);

  // Sync profile form data when user state updates
  useEffect(() => {
    if (user) {
      setProfileFormData({
        name: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  // Validate profile form inputs
  const validateProfileForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!profileFormData.name.trim()) newErrors.name = 'Name is required';
    if (!profileFormData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(profileFormData.email)) newErrors.email = 'Invalid email format';
    if (profileFormData.phone && !/^\+?[\d\s-]{10,}$/.test(profileFormData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate password form inputs
  const validatePasswordForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!passwordFormData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordFormData.newPassword) newErrors.newPassword = 'New password is required';
    else if (passwordFormData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
          'https://ssa-serverr.onrender.com/api/auth/profile',
          {
            username: profileFormData.name,
            email: profileFormData.email,
            phone: profileFormData.phone,
            location: profileFormData.location,
            bio: profileFormData.bio
          },
          { headers: { Authorization: `Bearer ${token}` } }
      );

      updateProfile({
        username: response.data.user.username,
        email: response.data.user.email,
        phone: response.data.user.phone,
        location: response.data.user.location,
        bio: response.data.user.bio
      });

      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update error:', err);
      alert('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
          'https://ssa-serverr.onrender.com/api/auth/password',
          {
            currentPassword: passwordFormData.currentPassword,
            newPassword: passwordFormData.newPassword
          },
          { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Password updated successfully!');
      setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Password update error:', err);
      alert('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(
          'https://ssa-serverr.onrender.com/api/auth/avatar',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
      );

      // <-- Updated: re-fetch profile after uploading avatar
      await getProfile();
      alert('Profile picture updated!');
    } catch (err) {
      console.error('Avatar upload error:', err);
      alert('Failed to update profile picture.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Account Settings</h1>
            <p className="text-gray-400 mt-2">Manage your account preferences and settings</p>
          </div>

          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            {/* Tab Navigation */}
            <div className="border-b border-gray-700">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                                ? 'border-purple-500 text-purple-400'
                                : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <img
                            src={user?.avatar || 'https://via.placeholder.com/150'}
                            alt={user?.username}
                            className="h-24 w-24 rounded-full object-cover"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            id="avatarUpload"
                            className="hidden"
                            onChange={handlePhotoChange}
                            disabled={isLoading}
                        />
                        <label
                            htmlFor="avatarUpload"
                            className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 p-2 rounded-full cursor-pointer transition-colors disabled:opacity-50"
                        >
                          <Camera className="h-4 w-4 text-white" />
                        </label>
                      </div>
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                name="name"
                                value={profileFormData.name}
                                onChange={handleProfileChange}
                                className={`w-full pl-10 pr-4 py-3 bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                disabled={isLoading}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="email"
                                name="email"
                                value={profileFormData.email}
                                onChange={handleProfileChange}
                                className={`w-full pl-10 pr-4 py-3 bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                disabled={isLoading}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Phone Number
                          </label>
                          <input
                              type="tel"
                              name="phone"
                              value={profileFormData.phone}
                              onChange={handleProfileChange}
                              placeholder="+1 (555) 123-4567"
                              className={`w-full px-4 py-3 bg-gray-700 border ${errors.phone ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                              disabled={isLoading}
                          />
                          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Location
                          </label>
                          <input
                              type="text"
                              name="location"
                              value={profileFormData.location}
                              onChange={handleProfileChange}
                              placeholder="San Francisco, CA"
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Bio
                        </label>
                        <textarea
                            name="bio"
                            value={profileFormData.bio}
                            onChange={handleProfileChange}
                            rows={4}
                            placeholder="Tell us about yourself..."
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={isLoading}
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                          {isLoading ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                              <>
                                <Save className="h-5 w-5" />
                                <span>Save Changes</span>
                              </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">Security Settings</h3>
                    <div className="space-y-6">
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-medium text-white mb-2">Change Password</h4>
                        <p className="text-sm text-gray-400 mb-4">Update your password to keep your account secure</p>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                              <input
                                  type="password"
                                  name="currentPassword"
                                  value={passwordFormData.currentPassword}
                                  onChange={handlePasswordChange}
                                  className={`w-full pl-10 pr-4 py-3 bg-gray-700 border ${errors.currentPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                  disabled={isLoading}
                              />
                              {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              New Password
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                              <input
                                  type="password"
                                  name="newPassword"
                                  value={passwordFormData.newPassword}
                                  onChange={handlePasswordChange}
                                  className={`w-full pl-10 pr-4 py-3 bg-gray-700 border ${errors.newPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                  disabled={isLoading}
                              />
                              {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                              <input
                                  type="password"
                                  name="confirmPassword"
                                  value={passwordFormData.confirmPassword}
                                  onChange={handlePasswordChange}
                                  className={`w-full pl-10 pr-4 py-3 bg-gray-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                  disabled={isLoading}
                              />
                              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                              {isLoading ? (
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              ) : (
                                  <>
                                    <Save className="h-5 w-5" />
                                    <span>Update Password</span>
                                  </>
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Profile;