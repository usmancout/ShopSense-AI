import React from 'react';
import { Shield, CheckCircle, Download, Trash2, Eye, Lock, Mail, AlertCircle } from 'lucide-react';

const GDPRCompliance: React.FC = () => {
    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <Shield className="h-8 w-8 text-purple-400" />
                        <h1 className="text-4xl font-bold">GDPR Compliance</h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Your data protection rights under the General Data Protection Regulation
                    </p>
                </div>

                <div className="bg-gray-800 rounded-xl p-8 space-y-8">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Our Commitment to GDPR</h2>
                        <p className="text-gray-300 leading-relaxed">
                            ShopSenseAI is committed to protecting your personal data and respecting your privacy rights under the
                            General Data Protection Regulation (GDPR). This page outlines how we comply with GDPR requirements and
                            explains your rights as a data subject.
                        </p>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-6">Your Data Protection Rights</h2>
                        <div className="grid gap-6">

                            {/* Right to Information */}
                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Eye className="h-6 w-6 text-blue-400" />
                                    <h3 className="text-lg font-semibold">Right to Information</h3>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    You have the right to know what personal data we collect, how we use it, and who we share it with.
                                    This information is detailed in our Privacy Policy.
                                </p>
                            </div>

                            {/* Right of Access */}
                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Download className="h-6 w-6 text-green-400" />
                                    <h3 className="text-lg font-semibold">Right of Access</h3>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                                    You can request a copy of all personal data we hold about you. We will provide this information in a
                                    structured, commonly used, and machine-readable format.
                                </p>
                                <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors text-sm">
                                    Request My Data
                                </button>
                            </div>

                            {/* Right to Rectification */}
                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <CheckCircle className="h-6 w-6 text-purple-400" />
                                    <h3 className="text-lg font-semibold">Right to Rectification</h3>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                                    You can request that we correct any inaccurate or incomplete personal data we hold about you.
                                </p>
                                <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors text-sm">
                                    Update My Information
                                </button>
                            </div>

                            {/* Right to Erasure */}
                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Trash2 className="h-6 w-6 text-red-400" />
                                    <h3 className="text-lg font-semibold">Right to Erasure ("Right to be Forgotten")</h3>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                                    You can request that we delete your personal data under certain circumstances, such as when the data
                                    is no longer necessary for the original purpose.
                                </p>
                                <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-sm">
                                    Delete My Account
                                </button>
                            </div>

                            {/* Right to Restrict Processing */}
                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Lock className="h-6 w-6 text-yellow-400" />
                                    <h3 className="text-lg font-semibold">Right to Restrict Processing</h3>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    You can request that we limit how we use your personal data in certain situations, such as when you
                                    contest the accuracy of the data or object to our processing.
                                </p>
                            </div>

                            {/* Right to Data Portability */}
                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Download className="h-6 w-6 text-cyan-400" />
                                    <h3 className="text-lg font-semibold">Right to Data Portability</h3>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    You can request that we transfer your personal data to another service provider in a structured,
                                    commonly used, and machine-readable format.
                                </p>
                            </div>

                            {/* Right to Object */}
                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <AlertCircle className="h-6 w-6 text-orange-400" />
                                    <h3 className="text-lg font-semibold">Right to Object</h3>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    You can object to our processing of your personal data for direct marketing purposes or when processing
                                    is based on legitimate interests.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Legal Basis for Processing */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Legal Basis for Processing</h2>
                        <div className="space-y-4">
                            <p className="text-gray-300 leading-relaxed">
                                We process your personal data based on the following legal grounds:
                            </p>
                            <div className="bg-gray-700 rounded-lg p-4">
                                <ul className="space-y-3 text-gray-300 text-sm">
                                    <li><strong>Consent:</strong> When you have given clear consent for us to process your data for specific purposes</li>
                                    <li><strong>Contract:</strong> When processing is necessary to fulfill our contractual obligations to you</li>
                                    <li><strong>Legal Obligation:</strong> When we must process data to comply with legal requirements</li>
                                    <li><strong>Legitimate Interest:</strong> When processing is necessary for our legitimate business interests, balanced against your rights</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Data Protection Measures */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Our Data Protection Measures</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Technical Measures</h3>
                                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                                    <li>End-to-end encryption</li>
                                    <li>Secure data storage</li>
                                    <li>Regular security audits</li>
                                    <li>Access controls and authentication</li>
                                    <li>Data anonymization techniques</li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Organizational Measures</h3>
                                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                                    <li>Staff training on data protection</li>
                                    <li>Data protection impact assessments</li>
                                    <li>Privacy by design principles</li>
                                    <li>Regular policy reviews</li>
                                    <li>Incident response procedures</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Data Retention */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
                        <div className="bg-gray-700 rounded-lg p-6">
                            <p className="text-gray-300 leading-relaxed mb-4">
                                We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected:
                            </p>
                            <div className="space-y-2 text-gray-300 text-sm">
                                <p><strong>Account Data:</strong> Retained while your account is active and for 2 years after closure</p>
                                <p><strong>Transaction Data:</strong> Retained for 7 years for legal and tax purposes</p>
                                <p><strong>Marketing Data:</strong> Retained until you withdraw consent or for 3 years of inactivity</p>
                                <p><strong>Analytics Data:</strong> Anonymized and retained for statistical purposes</p>
                            </div>
                        </div>
                    </section>

                    {/* International Transfers */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
                        <p className="text-gray-300 leading-relaxed">
                            When we transfer your personal data outside the European Economic Area (EEA), we ensure appropriate safeguards
                            are in place, such as Standard Contractual Clauses approved by the European Commission or transfers to countries
                            with adequacy decisions.
                        </p>
                    </section>

                    {/* Data Protection Officer */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Data Protection Officer</h2>
                        <div className="bg-gray-700 rounded-lg p-6">
                            <p className="text-gray-300 leading-relaxed mb-4">
                                Our Data Protection Officer (DPO) is responsible for overseeing our data protection strategy and ensuring
                                GDPR compliance. You can contact our DPO directly with any data protection concerns:
                            </p>
                            <div className="space-y-2 text-gray-300">
                                <p><strong>Email:</strong> dpo@shopsenseai.com</p>
                                <p><strong>Address:</strong> Data Protection Officer, ShopSenseAI, 47 C Civic Center Johar Town Block D، 2, Block D 2 Phase 1 Johar Town, Lahore, 54600, Pakistan</p>
                            </div>
                        </div>
                    </section>

                    {/* Complaints */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Filing a Complaint</h2>
                        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-6">
                            <p className="text-blue-200 leading-relaxed">
                                If you believe we have not handled your personal data in accordance with GDPR, you have the right to file
                                a complaint with your local data protection authority. You can also contact us directly to resolve any concerns.
                            </p>
                        </div>
                    </section>

                    {/* Contact for GDPR Requests */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
                            <Mail className="h-6 w-6 text-purple-400" />
                            <span>GDPR Requests</span>
                        </h2>
                        <div className="bg-gray-700 rounded-lg p-6">
                            <p className="text-gray-300 mb-4">
                                To exercise any of your GDPR rights or if you have questions about our data protection practices:
                            </p>
                            <div className="space-y-2 text-gray-300">
                                <p><strong>Email:</strong> gdpr@shopsenseai.com</p>
                                <p><strong>Subject Line:</strong> GDPR Request - [Type of Request]</p>
                                <p><strong>Response Time:</strong> We will respond within 30 days of receiving your request</p>
                            </div>
                            <div className="mt-4 p-4 bg-gray-600 rounded-lg">
                                <p className="text-gray-300 text-sm">
                                    <strong>Note:</strong> To protect your privacy, we may need to verify your identity before processing
                                    certain requests. Please include sufficient information to help us locate your account.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default GDPRCompliance;