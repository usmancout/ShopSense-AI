import React from 'react';
import { Cookie, Settings, Eye, BarChart3, Shield, Mail } from 'lucide-react';

const CookiePolicy: React.FC = () => {
    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <Cookie className="h-8 w-8 text-purple-400" />
                        <h1 className="text-4xl font-bold">Cookie Policy</h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Last updated: January 15, 2024
                    </p>
                </div>

                <div className="bg-gray-800 rounded-xl p-8 space-y-8">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Cookies are small text files that are stored on your device when you visit our website. They help us provide
                            you with a better experience by remembering your preferences, analyzing how you use our site, and personalizing
                            content and advertisements.
                        </p>
                    </section>

                    {/* How We Use Cookies */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
                            <Settings className="h-6 w-6 text-purple-400" />
                            <span>How We Use Cookies</span>
                        </h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            ShopSenseAI uses cookies for various purposes to enhance your shopping experience:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li>Remember your login status and preferences</li>
                            <li>Personalize product recommendations using AI</li>
                            <li>Analyze website traffic and user behavior</li>
                            <li>Improve our services and user interface</li>
                            <li>Provide targeted advertisements</li>
                            <li>Enable social media features</li>
                        </ul>
                    </section>

                    {/* Types of Cookies */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-6">Types of Cookies We Use</h2>

                        <div className="grid gap-6">
                            {/* Essential Cookies */}
                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Shield className="h-6 w-6 text-green-400" />
                                    <h3 className="text-lg font-semibold">Essential Cookies</h3>
                                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Required</span>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    These cookies are necessary for the website to function properly. They enable core functionality such as
                                    security, network management, and accessibility. You cannot opt-out of these cookies.
                                </p>
                                <div className="mt-3">
                                    <p className="text-xs text-gray-400"><strong>Examples:</strong> Session management, authentication, security</p>
                                </div>
                            </div>

                            {/* Performance Cookies */}
                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <BarChart3 className="h-6 w-6 text-blue-400" />
                                    <h3 className="text-lg font-semibold">Performance Cookies</h3>
                                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Optional</span>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    These cookies collect information about how you use our website, such as which pages you visit most often.
                                    This data helps us improve our website performance and user experience.
                                </p>
                                <div className="mt-3">
                                    <p className="text-xs text-gray-400"><strong>Examples:</strong> Google Analytics, page load times, error tracking</p>
                                </div>
                            </div>

                            {/* Functional Cookies */}
                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Settings className="h-6 w-6 text-purple-400" />
                                    <h3 className="text-lg font-semibold">Functional Cookies</h3>
                                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">Optional</span>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    These cookies enable enhanced functionality and personalization. They remember your choices and preferences
                                    to provide a more personalized experience.
                                </p>
                                <div className="mt-3">
                                    <p className="text-xs text-gray-400"><strong>Examples:</strong> Language preferences, wishlist items, search history</p>
                                </div>
                            </div>

                            {/* Targeting Cookies */}
                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Eye className="h-6 w-6 text-orange-400" />
                                    <h3 className="text-lg font-semibold">Targeting/Advertising Cookies</h3>
                                    <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">Optional</span>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    These cookies are used to deliver advertisements that are relevant to you and your interests. They also
                                    help measure the effectiveness of advertising campaigns.
                                </p>
                                <div className="mt-3">
                                    <p className="text-xs text-gray-400"><strong>Examples:</strong> Product recommendations, targeted ads, social media pixels</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Third-Party Cookies */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
                        <div className="space-y-4">
                            <p className="text-gray-300 leading-relaxed">
                                We also use third-party cookies from trusted partners to enhance your experience:
                            </p>
                            <div className="bg-gray-700 rounded-lg p-4">
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <h4 className="font-medium text-white mb-2">Analytics Partners</h4>
                                        <ul className="text-gray-300 space-y-1">
                                            <li>• Google Analytics</li>
                                            <li>• Hotjar</li>
                                            <li>• Mixpanel</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white mb-2">Advertising Partners</h4>
                                        <ul className="text-gray-300 space-y-1">
                                            <li>• Google Ads</li>
                                            <li>• Facebook Pixel</li>
                                            <li>• Amazon Associates</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Managing Cookies */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Managing Your Cookie Preferences</h2>
                        <div className="space-y-4">
                            <p className="text-gray-300 leading-relaxed">
                                You have several options for managing cookies:
                            </p>

                            <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-3">Cookie Consent Manager</h3>
                                <p className="text-gray-300 text-sm mb-4">
                                    Use our cookie consent tool to customize your preferences for different types of cookies.
                                </p>
                                <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors text-sm">
                                    Manage Cookie Preferences
                                </button>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold">Browser Settings</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    You can also control cookies through your browser settings. Here's how to manage cookies in popular browsers:
                                </p>
                                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                                    <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                                    <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                                    <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                                    <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Impact of Disabling Cookies */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Impact of Disabling Cookies</h2>
                        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                            <p className="text-yellow-200 text-sm leading-relaxed">
                                <strong>Please note:</strong> Disabling certain cookies may impact your experience on ShopSenseAI.
                                Some features may not work properly, and you may not receive personalized recommendations.
                            </p>
                        </div>
                    </section>

                    {/* Updates to Policy */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational,
                            legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page.
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
                                If you have any questions about our use of cookies, please contact us:
                            </p>
                            <div className="space-y-2 text-gray-300">
                                <p><strong>Email:</strong> cookies@shopsenseai.com</p>
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

export default CookiePolicy;