'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/glass-card'
import { Header } from '@/components/ui/header'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header variant="minimal" />
      
      <div className="pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Link */}
          <Link 
            href="/" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <GlassCard className="p-8 md:p-12" variant="elevated">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">EP</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  EstatePlan Pro
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
              <p className="text-gray-500">Last Updated: January 9, 2026</p>
            </div>

            {/* Privacy Content */}
            <div className="prose prose-slate max-w-none">
              <section className="mb-8">
                <p className="text-gray-600 mb-4 text-lg">
                  At Estate PlanPro, we care about the privacy of your data and are committed to protecting it. This Privacy Policy 
                  explains what information we collect about you and why. We hope you will read it carefully.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What is the scope of this Privacy Policy?</h2>
                <p className="text-gray-600 mb-4">
                  This Privacy Policy is incorporated into Estate PlanPro&apos;s Terms of Service and applies to the information obtained 
                  by us through your use of Estate PlanPro&apos;s site, software, and services (&quot;Information&quot;) as described in this Policy. 
                  Capitalized terms used in this Policy and not otherwise defined shall have the meanings provided for those terms 
                  in the Terms of Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What is Estate PlanPro&apos;s business model?</h2>
                <p className="text-gray-600 mb-4">
                  Estate PlanPro offers a free service and paid services. To make money, we encourage the users of our free service 
                  to upgrade to one of our paid services. We don&apos;t help third parties to advertise their products to you. We also 
                  do not—and will not—sell your information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Information Collection and Use</h2>
                
                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">What Information does Estate PlanPro collect about me?</h3>
                <p className="text-gray-600 mb-4">
                  When you interact with our site, software, and/or services, we collect information that could be used to identify 
                  you (&quot;Personal Data&quot;). Some of the information we collect is stored in a manner that cannot be linked back to you 
                  (&quot;Non-Personal Data&quot;).
                </p>

                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Information you provide when you create an account</h3>
                <p className="text-gray-600 mb-4">
                  When you sign up for or use our services, you voluntarily give us certain Personal Data, including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Your username, email address, and contact preferences</li>
                  <li>If you log into Estate PlanPro with a social networking credential, such as with your Google account, we will 
                  ask permission to access basic information from that account, such as your name and email address</li>
                  <li>Your payment information, if you are a paying customer</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Estate Planning Information</h3>
                <p className="text-gray-600 mb-4">
                  Given the nature of our Services, you may provide us with sensitive personal information including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Personal identifying information (name, date of birth, Social Security Number)</li>
                  <li>Family relationships and beneficiary information</li>
                  <li>Asset and property information</li>
                  <li>Healthcare preferences and directives</li>
                  <li>Information about appointed agents and executors</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  <strong>We treat this information with the highest level of security.</strong> This data is encrypted using AES-256 
                  encryption both in transit and at rest.
                </p>

                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Automatically collected Information</h3>
                <p className="text-gray-600 mb-4">
                  Certain data about the devices you use to connect with Estate PlanPro and your use of the site, software, and/or 
                  services are automatically logged in our systems, including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li><strong>Location information:</strong> The geographic area where you use your computer and mobile devices 
                  (as indicated by an Internet Protocol (IP) address or similar identifier)</li>
                  <li><strong>Log data:</strong> Our servers automatically collect data when you access or use our site and record 
                  it in log files, including IP address, browser type and settings, date and time of use</li>
                  <li><strong>Usage information:</strong> Information about the Estate PlanPro site, software, and/or services you 
                  use and how you use them</li>
                  <li><strong>Device information:</strong> Data from your computer or mobile device, such as the type of hardware 
                  and software you are using</li>
                  <li><strong>Cookies:</strong> Data obtained from cookies as described in our Cookie Policy</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">How does Estate PlanPro use my Information?</h2>
                <p className="text-gray-600 mb-4">
                  We use, process, and store your Information as necessary to perform our contract with you and for our legitimate 
                  business interests, including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>To help us provide and administer our site, software, and/or services</li>
                  <li>To authenticate users for security purposes and provide personalized features</li>
                  <li>To generate your estate planning documents</li>
                  <li>To process transactions and conduct research to improve our services</li>
                  <li>To communicate with you about your use of our services, product announcements, and software updates</li>
                  <li>To respond to your requests for assistance</li>
                  <li>To calculate aggregate statistics and detect and prevent fraud and misuse</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Does Estate PlanPro share my Information?</h2>
                <p className="text-gray-600 mb-4">
                  We only disclose Personal Data to third parties when:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>We use service providers who assist us in meeting business operations needs, including hosting and delivering 
                  our services. These service providers may only access, process, or store Personal Data pursuant to our instructions.</li>
                  <li>We have your explicit consent to share your Personal Data.</li>
                  <li>We believe it is necessary to investigate potential violations of the Terms of Service or to protect against 
                  illegal activities, suspected fraud, or potential threats.</li>
                  <li>We determine that the access, preservation, or disclosure of your Personal Data is required by law.</li>
                  <li>We need to do so in connection with a merger, acquisition, bankruptcy, or sale of some or all of our assets.</li>
                </ul>
                <p className="text-gray-600 mb-4 font-semibold">
                  Estate PlanPro does not sell or rent your Personal Data to third parties.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Security</h2>
                <p className="text-gray-600 mb-4">
                  Estate PlanPro is committed to protecting the security of your Information and takes reasonable precautions to 
                  protect it. Our security measures include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li><strong>Encryption:</strong> We use industry-standard AES-256 encryption to protect your data in transit and at rest</li>
                  <li><strong>Access Controls:</strong> Strict access controls limit who can view your data within our organization</li>
                  <li><strong>SOC2 Compliance:</strong> We maintain SOC2 compliance for security, availability, and confidentiality</li>
                  <li><strong>Regular Audits:</strong> We conduct regular security audits and vulnerability assessments</li>
                  <li><strong>Two-Factor Authentication:</strong> We offer 2FA to add an extra layer of security to your account</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  However, internet data transmissions cannot be guaranteed to be 100% secure. We recommend that you take appropriate 
                  steps to secure all computing devices that you use in connection with our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Storage and Retention</h2>
                
                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Where is my Information stored?</h3>
                <p className="text-gray-600 mb-4">
                  Information submitted to Estate PlanPro will be transferred to, processed, and stored in the United States. 
                  If you post or transfer any Information to or through our services, you are agreeing to such Information being 
                  hosted and accessed in the United States.
                </p>

                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">How can I delete my Personal Data?</h3>
                <p className="text-gray-600 mb-4">
                  You can remove your Personal Data from Estate PlanPro at any time by logging into your account, accessing the 
                  Settings page, and then deleting your account. Please note that, for security reasons, subscribers of our paid 
                  services will first be instructed to cancel their subscriptions before they can delete their Estate PlanPro account.
                </p>

                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">How long is Personal Data retained?</h3>
                <p className="text-gray-600 mb-4">
                  You can remove your Personal Data from Estate PlanPro at any time by deleting your account. However, we may keep 
                  some of your Personal Data for as long as reasonably necessary for our legitimate business interests, including 
                  fraud detection and prevention and to comply with our legal obligations including tax, legal reporting, and 
                  auditing obligations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Rights</h2>
                
                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">For California Residents (CCPA)</h3>
                <p className="text-gray-600 mb-4">
                  If you&apos;re a California resident, California law may permit you to request that we:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Provide access to and/or a copy of certain information we hold about you</li>
                  <li>Provide you a summary of the categories of personal information we have collected about you</li>
                  <li>Delete certain information we have about you</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  We do not sell your personal information. Even though we do not sell your personal information, you have the 
                  right to opt-out of any potential future selling of your personal information.
                </p>

                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">For EEA, Swiss, and UK Users (GDPR)</h3>
                <p className="text-gray-600 mb-4">
                  Individuals located in the European Economic Area (EEA), Switzerland, and the UK have certain rights in respect 
                  to their personal information, including the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Access, correct, or delete Personal Data</li>
                  <li>Object to us processing your Personal Data</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent at any time</li>
                  <li>Lodge a complaint with a supervisory authority</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Children&apos;s Privacy</h2>
                <p className="text-gray-600 mb-4">
                  Estate PlanPro does not knowingly collect personal information from children under the age of 13. If we determine 
                  we have collected personal information from a child younger than 13 years of age, we will take reasonable measures 
                  to remove that information from our systems.
                </p>
                <p className="text-gray-600 mb-4">
                  If you are under the age of 13, please do not submit any personal information through the site, service, and/or software.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Cookies and Similar Technologies</h2>
                <p className="text-gray-600 mb-4">
                  We use cookies, pixels, and similar technologies to operate our services (essential cookies) and—where required 
                  by law, with your consent—to measure usage and improve features (analytics).
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li><strong>Essential cookies:</strong> These are needed to provide core site/app functionality, security, and 
                  fraud prevention. They cannot be switched off.</li>
                  <li><strong>Analytics cookies:</strong> With your consent, we use analytics to understand how our services are 
                  used and to improve performance.</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  You can manage your cookie preferences through your browser settings or through our cookie consent tool.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
                <p className="text-gray-600 mb-4">
                  As Estate PlanPro evolves, we may need to update this Policy to keep pace with changes in our services, our business, 
                  and laws applicable to us and you. We will, however, always maintain our commitment to respect your privacy.
                </p>
                <p className="text-gray-600 mb-4">
                  We will notify you of any material changes that impact your rights under this Policy by email (to your most recently 
                  provided email address) or post any other revisions to this Policy, along with their effective date, in an easy-to-find 
                  area of the site.
                </p>
                <p className="text-gray-600 mb-4">
                  Please note that your continued use of Estate PlanPro after any change means that you agree with and consent to be 
                  bound by the new Policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions regarding this Privacy Policy or how Estate PlanPro uses your information, you may contact us at:
                </p>
                <p className="text-gray-600 mb-4">
                  Estate PlanPro, Inc.<br />
                  Email: privacy@estateplanpro.com<br />
                  Support: support@estateplanpro.com
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                By using Estate PlanPro, you acknowledge that you have read and understood this Privacy Policy.
              </p>
              <div className="mt-4 flex justify-center space-x-4">
                <Link href="/terms" className="text-primary-600 hover:text-primary-700 text-sm">
                  Terms of Service
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/" className="text-primary-600 hover:text-primary-700 text-sm">
                  Back to Home
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
      </div>
    </div>
  )
}
