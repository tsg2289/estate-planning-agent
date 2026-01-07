'use client'

import { useState } from 'react'

export default function DemoLandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Glass Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/20 backdrop-blur-2xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EP</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                EstatePlan Pro
              </span>
            </div>
            <div className="flex space-x-4">
              <button className="px-4 py-2 text-gray-700 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-xl">
                Sign In
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500/80 to-pink-500/80 text-white rounded-xl hover:scale-105 transition-all duration-300 backdrop-blur-xl shadow-lg">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl animate-pulse">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Secure Estate Planning
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Professional estate planning with enterprise-grade security, AI assistance, and SOC2 compliance. 
            Protect your legacy with complete data anonymization and bank-level encryption.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500/80 to-pink-500/80 text-white rounded-xl hover:scale-105 transition-all duration-300 backdrop-blur-xl shadow-lg">
              Start Planning Now
            </button>
            <button className="px-8 py-4 bg-white/20 text-gray-900 hover:bg-white/30 rounded-xl transition-all duration-300 backdrop-blur-xl border border-white/20 shadow-lg">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              Why Choose EstatePlan Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for professionals who demand the highest standards of security and compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-8 bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl transition-all duration-300 hover:bg-white/30 hover:scale-105 shadow-lg ${
                  hoveredFeature === index ? 'scale-105 shadow-2xl' : ''
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`text-4xl mb-6 transition-transform duration-300 ${
                  hoveredFeature === index ? 'scale-110' : ''
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="mt-6">
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature.highlight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50/50 to-pink-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              Enterprise-Grade Security
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your sensitive estate planning data is protected with the same security standards used by Fortune 500 companies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl transition-all duration-300 hover:bg-white/30 shadow-lg"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">🔒</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              Ready to Secure Your Legacy?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of professionals who trust EstatePlan Pro with their most important documents
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500/80 to-pink-500/80 text-white rounded-xl hover:scale-105 transition-all duration-300 backdrop-blur-xl shadow-lg">
                Start Free Trial
              </button>
              <button className="px-8 py-4 bg-white/20 text-gray-900 hover:bg-white/30 rounded-xl transition-all duration-300 backdrop-blur-xl border border-white/20 shadow-lg">
                Schedule Demo
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • 30-day free trial • SOC2 compliant
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-pink-500 rounded"></div>
            <span className="text-lg font-semibold text-gray-900">EstatePlan Pro</span>
          </div>
          <p className="text-gray-600 mb-4">
            Professional estate planning with enterprise-grade security
          </p>
          <p className="text-sm text-gray-500">
            © 2024 EstatePlan Pro. All rights reserved. SOC2 Type II Certified.
          </p>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: '🛡️',
    title: 'SOC2 Compliant',
    description: 'Enterprise-grade security with complete data isolation, audit trails, and compliance monitoring that meets the highest industry standards.',
    highlight: 'Bank-level encryption'
  },
  {
    icon: '🤖',
    title: 'AI-Powered Assistance',
    description: 'Intelligent document generation and legal guidance with complete data anonymization before any AI processing to protect client confidentiality.',
    highlight: 'Complete data anonymization'
  },
  {
    icon: '📄',
    title: 'Professional Documents',
    description: 'Generate legally compliant wills, trusts, power of attorney, and healthcare directives with state-specific requirements and professional formatting.',
    highlight: 'State-specific compliance'
  },
  {
    icon: '🔒',
    title: 'Zero-Trust Security',
    description: 'Every action is logged, every access is verified, and every piece of data is encrypted both at rest and in transit with military-grade protection.',
    highlight: 'Military-grade encryption'
  },
  {
    icon: '👥',
    title: 'Multi-Tenant Isolation',
    description: 'Complete separation of client data with row-level security policies ensuring no cross-contamination of sensitive information between users.',
    highlight: 'Complete data isolation'
  },
  {
    icon: '✅',
    title: 'Audit Ready',
    description: 'Comprehensive audit logging and compliance reporting tools that make regulatory reviews and security audits straightforward and transparent.',
    highlight: 'Full audit trails'
  }
]

const securityFeatures = [
  {
    title: 'Data Anonymization',
    description: 'All data is automatically anonymized before any AI processing, ensuring client confidentiality is maintained at all times.'
  },
  {
    title: 'End-to-End Encryption',
    description: 'AES-256 encryption for data at rest and TLS 1.3 for data in transit, with keys managed through secure key management systems.'
  },
  {
    title: 'Row-Level Security',
    description: 'Database-level security policies ensure complete isolation between clients with automatic access control enforcement.'
  },
  {
    title: 'Audit Logging',
    description: 'Every action is logged with tamper-proof audit trails that meet SOC2 and other compliance requirements.'
  }
]