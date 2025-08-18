import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            console.log(response.data); // optional: debug
            setIsSuccess(true);
        } catch (err: any) {
            console.error(err);
            setError(
                err.response?.data?.message || 'Failed to send reset email. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setEmail('');
        setError('');
        setIsSuccess(false);
        setIsLoading(false);
        onClose();
    };

    const handleBackToLogin = () => {
        setIsSuccess(false);
        setEmail('');
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 relative">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {!isSuccess ? (
                    <>
                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
                            <p className="text-gray-400 text-sm">
                                No worries! Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="email"
                                        id="reset-email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Enter your email address"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" />
                                        <span>Send Reset Link</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Back to Sign In */}
                        <div className="text-center mt-6">
                            <button
                                onClick={handleClose}
                                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors flex items-center justify-center space-x-1 mx-auto"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back to Sign In</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Success State */}
                        <div className="text-center">
                            <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                We've sent a password reset link to <strong className="text-white">{email}</strong>
                            </p>

                            <div className="bg-blue-900/50 border border-blue-500 text-blue-200 px-4 py-3 rounded-lg text-sm mb-6">
                                <p className="mb-2">Didn't receive the email? Check your spam folder or try again.</p>
                                <p>The reset link will expire in 15 minutes for security.</p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleBackToLogin}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                                >
                                    Send Another Email
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="w-full text-purple-400 hover:text-purple-300 py-2 font-medium transition-colors flex items-center justify-center space-x-1"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span>Back to Sign In</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
