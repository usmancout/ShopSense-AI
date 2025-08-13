import React from 'react';
import { Shield, Eye, Lock, Database, UserCheck, Mail } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <Shield className="h-8 w-8 text-purple-400" />
                        <h1 className="text-4xl font-bold">Privacy Policy</h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Last updated: January 15, 2024
                    </p>
                </div>

                <div className="bg-gray-800 rounded-xl p-8 space-y-8">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
                            <Eye className="h-6 w-6 text-purple-400" />
                            <span>Introduction</span>
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            At ShopSenseAI, we are committed to protecting your privacy and ensuring the security of your personal information.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
                            AI-powered e-commerce platform and related services.
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
                            <Database className="h-6 w-6 text-purple-400" />
                            <span>Information We Collect</span>
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-1">
                                    <li>Name, email address, and contact information</li>
                                    <li>Account credentials and profile information</li>
                                    <li>Payment information (processed securely through third-party providers)</li>
                                    <li>Shipping and billing addresses</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-2">Usage Information</h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-1">
                                    <li>Search queries and browsing history on our platform</li>
                                    <li>Product preferences and wishlist items</li>
                                    <li>Device information and IP address</li>
                                    <li>Cookies and similar tracking technologies</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* How We Use Your Information */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
                            <UserCheck className="h-6 w-6 text-purple-400" />
                            <span>How We Use Your Information</span>
                        </h2>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li>Provide and improve our AI-powered product recommendations</li>
                            <li>Process transactions and manage your account</li>
                            <li>Send you relevant product updates and promotional offers</li>
                            <li>Analyze usage patterns to enhance user experience</li>
                            <li>Comply with legal obligations and prevent fraud</li>
                            <li>Provide customer support and respond to inquiries</li>
                        </ul>
                    </section>

                    {/* Information Sharing */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Information Sharing and Disclosure</h2>
                        <div className="space-y-4">
                            <p className="text-gray-300">We do not sell your personal information. We may share your information in the following circumstances:</p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li><strong>Partner Stores:</strong> When you choose to purchase from a partner store, we share necessary information to complete the transaction</li>
                                <li><strong>Service Providers:</strong> With trusted third-party services that help us operate our platform</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and users' safety</li>
                                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                            </ul>
                        </div>
                    </section>

                    {/* Data Security */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
                            <Lock className="h-6 w-6 text-purple-400" />
                            <span>Data Security</span>
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            We implement industry-standard security measures to protect your personal information, including encryption,
                            secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure,
                            and we cannot guarantee absolute security.
                        </p>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Your Rights and Choices</h2>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li>Access, update, or delete your personal information</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Request data portability</li>
                            <li>Withdraw consent for data processing</li>
                            <li>File complaints with relevant data protection authorities</li>
                        </ul>
                    </section>

                    {/* Cookies */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content.
                            You can control cookie settings through your browser preferences. For more details, please see our Cookie Policy.
                        </p>
                    </section>

                    {/* Children's Privacy */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information
                            from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                        </p>
                    </section>

                    {/* Changes to Policy */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the
                            new policy on this page and updating the "Last updated" date. Your continued use of our services after such
                            changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
                            <Mail className="h-6 w-6 text-purple-400" />
                            <span>Contact Us</span>
                        </h2>
                        <div className="bg-gray-700 rounded-lg p-6">
                            <p className="text-gray-300 mb-4">
                                If you have any questions about this Privacy Policy or our data practices, please contact us:
                            </p>
                            <div className="space-y-2 text-gray-300">
                                <p><strong>Email:</strong> privacy@shopsenseai.com</p>
                                <p><strong>Address:</strong> 47 C Civic Center Johar Town Block D، 2, Block D 2 Phase 1 Johar Town, Lahore, 54600, Pakistan</p>
                                <p><strong>Phone:</strong> +923446679756</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;