import React from 'react';
import { FileText, Users, Shield, AlertTriangle, Scale, Mail } from 'lucide-react';

const TermsOfService: React.FC = () => {
    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <FileText className="h-8 w-8 text-purple-400" />
                        <h1 className="text-4xl font-bold">Terms of Service</h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Last updated: January 15, 2024
                    </p>
                </div>

                <div className="bg-gray-800 rounded-xl p-8 space-y-8">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
                        <p className="text-gray-300 leading-relaxed">
                            By accessing and using ShopSenseAI ("we," "our," or "us"), you accept and agree to be bound by the terms
                            and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                        </p>
                    </section>

                    {/* Service Description */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
                            <Users className="h-6 w-6 text-purple-400" />
                            <span>Service Description</span>
                        </h2>
                        <div className="space-y-4">
                            <p className="text-gray-300 leading-relaxed">
                                ShopSenseAI is an AI-powered e-commerce platform that provides:
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Product search and comparison across multiple online stores</li>
                                <li>Personalized product recommendations using artificial intelligence</li>
                                <li>Price tracking and alerts</li>
                                <li>User accounts and wishlist functionality</li>
                                <li>Integration with partner e-commerce platforms</li>
                            </ul>
                        </div>
                    </section>

                    {/* User Accounts */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
                        <div className="space-y-4">
                            <p className="text-gray-300 leading-relaxed">
                                To access certain features of our service, you must create an account. You agree to:
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Provide accurate, current, and complete information</li>
                                <li>Maintain and update your account information</li>
                                <li>Keep your password secure and confidential</li>
                                <li>Accept responsibility for all activities under your account</li>
                                <li>Notify us immediately of any unauthorized use</li>
                            </ul>
                        </div>
                    </section>

                    {/* Acceptable Use */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
                            <Shield className="h-6 w-6 text-purple-400" />
                            <span>Acceptable Use Policy</span>
                        </h2>
                        <div className="space-y-4">
                            <p className="text-gray-300 leading-relaxed">You agree not to use our service to:</p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Violate any applicable laws or regulations</li>
                                <li>Infringe on intellectual property rights</li>
                                <li>Transmit harmful, offensive, or inappropriate content</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Interfere with or disrupt our services</li>
                                <li>Use automated tools to scrape or harvest data</li>
                                <li>Impersonate others or provide false information</li>
                            </ul>
                        </div>
                    </section>

                    {/* Third-Party Services */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Third-Party Services and Links</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Our platform integrates with and links to third-party e-commerce sites and services. We are not responsible
                            for the content, privacy policies, or practices of these third parties. Your interactions with third-party
                            sites are governed by their respective terms and policies.
                        </p>
                    </section>

                    {/* Intellectual Property */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Intellectual Property Rights</h2>
                        <div className="space-y-4">
                            <p className="text-gray-300 leading-relaxed">
                                The ShopSenseAI platform, including its AI algorithms, design, content, and features, is owned by us and
                                protected by intellectual property laws. You are granted a limited, non-exclusive license to use our service
                                for personal, non-commercial purposes.
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                You retain ownership of any content you submit to our platform, but grant us a license to use, modify,
                                and display such content as necessary to provide our services.
                            </p>
                        </div>
                    </section>

                    {/* Privacy */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Privacy and Data Protection</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy,
                            which is incorporated into these Terms by reference. By using our service, you consent to the collection and
                            use of your information as described in our Privacy Policy.
                        </p>
                    </section>

                    {/* Disclaimers */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
                            <AlertTriangle className="h-6 w-6 text-yellow-400" />
                            <span>Disclaimers and Limitations</span>
                        </h2>
                        <div className="space-y-4">
                            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                                <p className="text-yellow-200 text-sm leading-relaxed">
                                    <strong>Important:</strong> Our service is provided "as is" without warranties of any kind. We do not guarantee
                                    the accuracy, completeness, or reliability of product information, prices, or availability from third-party stores.
                                </p>
                            </div>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>We are not responsible for transactions between you and third-party merchants</li>
                                <li>Product prices and availability may change without notice</li>
                                <li>AI recommendations are based on algorithms and may not always be accurate</li>
                                <li>We do not guarantee uninterrupted or error-free service</li>
                            </ul>
                        </div>
                    </section>

                    {/* Limitation of Liability */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
                            <Scale className="h-6 w-6 text-purple-400" />
                            <span>Limitation of Liability</span>
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            To the maximum extent permitted by law, ShopSenseAI shall not be liable for any indirect, incidental, special,
                            consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising from
                            your use of our service, even if we have been advised of the possibility of such damages.
                        </p>
                    </section>

                    {/* Termination */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Termination</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We may terminate or suspend your account and access to our service immediately, without prior notice, for any
                            reason, including breach of these Terms. Upon termination, your right to use the service will cease immediately,
                            and we may delete your account and associated data.
                        </p>
                    </section>

                    {/* Governing Law */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Governing Law and Jurisdiction</h2>
                        <p className="text-gray-300 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of Pakistan. Any disputes arising
                            from these Terms or your use of our service shall be subject to the exclusive jurisdiction of the courts in
                            Lahore, Pakistan.
                        </p>
                    </section>

                    {/* Changes to Terms */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We reserve the right to modify these Terms at any time. We will notify users of material changes by posting
                            the updated Terms on our platform and updating the "Last updated" date. Your continued use of our service
                            after such changes constitutes acceptance of the new Terms.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
                            <Mail className="h-6 w-6 text-purple-400" />
                            <span>Contact Information</span>
                        </h2>
                        <div className="bg-gray-700 rounded-lg p-6">
                            <p className="text-gray-300 mb-4">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            <div className="space-y-2 text-gray-300">
                                <p><strong>Email:</strong> legal@shopsenseai.com</p>
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

export default TermsOfService;