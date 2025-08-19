import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state, default to signin
  const from = '/signin'; // Always redirect to signin after signup

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Call signup without automatically logging in
      await signup({
        username: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      // Redirect to sign-in page
      navigate(from, { replace: true });
    } catch (error) {
      setErrors({ general: 'Failed to create account. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const { googleLogin: handleGoogleLogin } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await handleGoogleLogin(tokenResponse.access_token);
        navigate(from, { replace: true });
      } catch (error) {
        console.error('Google login failed:', error);
      }
    },
    onError: (error) => console.error('Google login error:', error),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold">Create Your Account</h2>
            <p className="mt-2 text-gray-400">
              Join ShopSenseAI and start shopping smarter today
            </p>
          </div>

          {/* Social Sign Up */}
          <div className="space-y-3">
            <button
                type="button"
                onClick={() => googleLogin()}
                className="w-full flex items-center justify-center space-x-3 bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="h-5 w-5"
              />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">
              Or continue with email
            </span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                  {errors.general}
                </div>
            )}

            {/* Full Name */}
            <div>
              <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-300 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                        errors.fullName ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                  <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                        errors.password ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Create a strong password"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                  ) : (
                      <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Confirm your password"
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                  ) : (
                      <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.confirmPassword}
                  </p>
              )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Create Account</span>
                  </>
              )}
            </button>

            {/* Email Verification Note */}
            <div className="bg-blue-900/50 border border-blue-500 text-blue-200 px-4 py-3 rounded-lg text-sm">
              <p>After signing up, please check your email to verify your account.</p>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link
                    to="/signin"
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
  );
};

export default SignUp;