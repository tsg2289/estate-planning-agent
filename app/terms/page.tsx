'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/glass-card'
import { Header } from '@/components/ui/header'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function TermsOfServicePage() {
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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
              <p className="text-gray-500">Last Updated: January 9, 2026</p>
            </div>

            {/* Terms Content */}
            <div className="prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. GENERAL INFORMATION</h2>
                
                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">1.1 ESTATE PLANPRO SERVICES</h3>
                <p className="text-gray-600 mb-4">
                  These Terms of Service (these &quot;Terms&quot;) contain the general terms and conditions on which Estate PlanPro 
                  (&quot;Estate PlanPro&quot;, &quot;us&quot;, &quot;our&quot; or &quot;we&quot;) supply, and under which you may use, the content, products and/or 
                  services available via the estateplanpro.com website (the &quot;Website&quot;), through applications we distribute for 
                  use on mobile devices (the &quot;Apps&quot;) or via other delivery methods to you (the Website and such content, products, 
                  services are collectively referred to herein as the &quot;Service&quot; or &quot;Services&quot;, which may be updated from 
                  time-to-time at the sole discretion of Estate PlanPro).
                </p>
                <p className="text-gray-600 mb-4">
                  Please read these terms and conditions carefully before accessing or ordering any Services from the Website or 
                  downloading any Apps from any third-party App stores (e.g., the Apple App Store, the Android Play Store, etc.). 
                  By using the Services, you acknowledge that you have read, understood, and agree to be bound by these Terms, 
                  including the provisions regarding arbitration, class action waiver, disclaimers, and limitations of liability.
                </p>
                <p className="text-gray-600 mb-4">
                  You further acknowledge that you have read, understood, and agree to be bound by our Privacy Policy and all 
                  other supplementary terms or Estate PlanPro policies incorporated herein by reference.
                </p>
                <p className="text-gray-600 mb-4">
                  In these terms, the term &quot;Device&quot; refers to the device which is used to access and use the Services and/or Apps, 
                  including but not limited to computers, smartphones, and tablets; and the term &quot;you&quot; refers to the user of the Services.
                </p>
                <p className="text-gray-600 mb-4">
                  When you order (&quot;Order&quot;) any Services, download any Apps, or otherwise use or access the Services, you agree to 
                  be bound by these Terms and all applicable laws, rules, and regulations. You may also be asked to click &quot;I accept&quot; 
                  at the appropriate place prior to your purchase, access to, or use of the Services. At such time, if you do not 
                  click &quot;I accept&quot;, you may not be able to complete such purchase or gain such access.
                </p>
                <p className="text-gray-600 mb-4">
                  By using the Services or Apps, you indicate that you accept these Terms and that you agree to abide by them. 
                  If you do not agree to these Terms, you must refrain from using the Services and/or Apps.
                </p>
                <p className="text-gray-600 mb-4">
                  You must be 18 years of age, or the age of majority in your province, territory, or country, to use the Services 
                  or Apps. Individuals under the age of 18, or the applicable age of majority (each, a &quot;Minor&quot;), may utilize the 
                  Services and Apps only with the involvement and consent of a parent or legal guardian, under such person&apos;s account 
                  and otherwise subject to these Terms. If you are a parent or legal guardian of a Minor, you agree to bind the Minor 
                  to these Terms and to fully indemnify and hold us harmless if the Minor breaches any of these Terms.
                </p>
                <p className="text-gray-600 mb-4">
                  Our contact email address is support@estateplanpro.com. All correspondence to Estate PlanPro, including any 
                  queries you may have regarding your use of the Services or these Terms, should be sent to this contact email address.
                </p>

                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">1.2 ORDERS</h3>
                <p className="text-gray-600 mb-4">
                  (a) Subject to the terms and conditions contained in these Terms, you may order certain Services by entering into 
                  one or more Orders. Orders may be entered into by you via the Services interface, or by written agreement or order 
                  form executed by you and an authorized representative of Estate PlanPro. Unless otherwise specified in the applicable 
                  Order, subscriptions are for designated users only and cannot be shared or used by more than one user. You agree that 
                  your purchases hereunder are neither contingent on the delivery of any future functionality or features nor dependent 
                  on any oral or written public comments made by Estate PlanPro regarding any future functionality or features. If there 
                  is any inconsistency between an Order and these Terms, the Order controls.
                </p>
                <p className="text-gray-600 mb-4">
                  (b) These Terms and the Order set out the whole agreement between you and us for the supply of the Services. In order 
                  to participate in certain Services, you may be required to agree to additional terms and conditions; those additional 
                  terms are hereby incorporated into these Terms. Where such terms are inconsistent with these Terms, the additional 
                  terms shall control.
                </p>
                <p className="text-gray-600 mb-4">
                  (c) Please check that the details in these Terms and on the Order are complete and accurate before you use or commit 
                  yourself to purchase the Services. If you think that there is a mistake, please make sure that you ask us to confirm 
                  any changes in writing.
                </p>

                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">1.3 CHANGES TO TERMS</h3>
                <p className="text-gray-600 mb-4">
                  We may modify these Terms at any time. When that happens, we will post the revised version on this page and update 
                  the &quot;Last Updated&quot; date. If a change is material—meaning it significantly affects your rights or obligations—we will 
                  also use a method reasonably calculated to reach you, such as an e-mail to the address in your account profile, an 
                  in-product banner, pop-up, push notification, or any other method allowed by law.
                </p>
                <p className="text-gray-600 mb-4">
                  Where applicable law requires advance notice (for example, certain auto-renewal or price-increase rules), we will 
                  provide at least the legally required notice period; otherwise, the revised Terms take effect upon posting. Your 
                  continued use of the Services or Apps after the effective date constitutes your acceptance of the revised Terms. 
                  If you do not agree to the new Terms, you must stop using the Services before they become effective and, if you have 
                  a paid subscription, you may cancel it through your account settings. You are responsible for keeping your contact 
                  information current so we can deliver any required notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. MEMBERSHIPS AND SUBSCRIPTIONS</h2>
                
                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">2.1 BECOMING A MEMBER</h3>
                <p className="text-gray-600 mb-4">
                  (a) You may sign up as a registered user of the Services free of charge (a &quot;Member&quot;). To become a Member, you need 
                  to go to the relevant section of the Services, then submit your email address to us, and create a password to be used 
                  in conjunction with that email address. You are responsible for maintaining the confidentiality of your account and 
                  password and for restricting access to your Device.
                </p>
                <p className="text-gray-600 mb-4">
                  (b) In the course of your use of the Services, you may be asked to provide certain personalized information to us 
                  (such information is referred to hereinafter as &quot;User Information&quot;). Our information collection and use policies 
                  with respect to the privacy of such User Information are set forth in the Estate PlanPro Privacy Policy. You 
                  acknowledge and agree that you are solely responsible for the accuracy and content of User Information, and you 
                  agree to keep it up to date.
                </p>
                <p className="text-gray-600 mb-4">
                  (c) By placing an Order or using the Services, you warrant that:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>(i) You are legally capable of entering into binding contracts;</li>
                  <li>(ii) All registration information you submit is truthful and accurate;</li>
                  <li>(iii) You will maintain the accuracy of such information; and</li>
                  <li>(iv) Your use of the Services does not violate any applicable law or regulation.</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">2.2 MEMBERSHIP</h3>
                <p className="text-gray-600 mb-4">
                  You are responsible for maintaining the confidentiality of your account, password, and other User Information and for 
                  restricting access to your Device to further help protect such information. You are responsible for updating your User 
                  Information. As an Estate PlanPro Member, you will receive access to certain sections, features, and functions of the 
                  Services that are not available to non-members. Estate PlanPro memberships and subscriptions are not transferable and 
                  therefore cannot be sold, exchanged, or transferred in any way whatsoever without Estate PlanPro&apos;s express written consent.
                </p>

                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">2.3 SUBSCRIPTIONS</h3>
                <p className="text-gray-600 mb-4">
                  (a) Estate PlanPro Members may access the Services in multiple ways including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>(i) &quot;Free Tier&quot; means a limited version of the Services free of charge. This version may include feature limitations, 
                  usage caps, and platform restrictions. Access to the Free Tier is provided at our sole discretion, is not guaranteed, 
                  and may be modified or terminated at any time without notice.</li>
                  <li>(ii) &quot;Paid Subscription&quot;: a subscription fee-based program, which gives access to additional features including and 
                  beyond the Free Tier, as further described on the Website.</li>
                  <li>(iii) &quot;Free Trial&quot; means a promotional, time-limited, no-charge subscription offer that gives you access to additional 
                  features including and beyond the &quot;Free Tier.&quot;</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  (b) IMPORTANT NOTICE – AUTOMATIC RENEWAL: Subscription terms will automatically renew for additional periods equal to the 
                  expiring subscription term unless you cancel in accordance with the cancellation terms. Upon such renewal, Estate PlanPro 
                  or our third-party payment partners will charge your payment method with the applicable subscription fee and any taxes 
                  that may be imposed on your payment.
                </p>
                <p className="text-gray-600 mb-4">
                  (c) CANCELLING: You may cancel your subscription at any time by initiating a cancellation through your Estate PlanPro 
                  account settings. Please note that subscription fees until the expiration of your then-current subscription term will 
                  not be refunded, in whole or in part, subject to applicable law.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. ESTATE PLANNING SERVICES DISCLAIMER</h2>
                <p className="text-gray-600 mb-4">
                  <strong>IMPORTANT:</strong> Estate PlanPro provides document templates, educational information, and AI-powered guidance 
                  to help you create estate planning documents. However, Estate PlanPro is NOT a law firm and does NOT provide legal advice.
                </p>
                <p className="text-gray-600 mb-4">
                  The information and documents generated through our Services are for informational and self-help purposes only. They are 
                  not a substitute for professional legal advice from a qualified attorney licensed in your jurisdiction.
                </p>
                <p className="text-gray-600 mb-4">
                  Estate planning laws vary significantly by state and country. We strongly recommend that you:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Consult with a licensed attorney before executing any estate planning documents</li>
                  <li>Have your documents reviewed by legal counsel familiar with your jurisdiction&apos;s requirements</li>
                  <li>Understand that improperly executed documents may not be legally valid</li>
                  <li>Recognize that our AI assistant provides general guidance, not personalized legal advice</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  By using our Services, you acknowledge and agree that Estate PlanPro shall not be held liable for any consequences arising 
                  from the use of documents created through our platform without proper legal review.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. ACCESSING AND USING THE SERVICES</h2>
                <p className="text-gray-600 mb-4">
                  Subject to your compliance with these Terms, including but not limited to your payment of all applicable fees, 
                  Estate PlanPro grants you, during the relevant Subscription Term, a limited, non-exclusive, non-transferable, revocable 
                  license to access and make personal use of the Services for which you have subscribed. You acknowledge and agree that 
                  the Services are provided under license, and not sold.
                </p>
                <p className="text-gray-600 mb-4">
                  You agree that you will not, and you will not assist or permit any third party to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>(a) Copy, store, reproduce, transmit, modify, alter, reverse-engineer, emulate, de-compile, or disassemble the 
                  Services in any way, or create derivative works of the Services;</li>
                  <li>(b) Rent, lease, loan, make available to the public, sell, or distribute the Services in whole or in part;</li>
                  <li>(c) Tamper with the Services or circumvent any technology used by Estate PlanPro to protect any content;</li>
                  <li>(d) Use the Services in a way that violates applicable law or these Terms;</li>
                  <li>(e) Use the Services to impersonate any other person or for any fraudulent purpose;</li>
                  <li>(f) Engage in any automated use of the Services, such as using scripts or bots;</li>
                  <li>(g) Attempt to probe, scan, or test the vulnerability of the Services or breach any security measures;</li>
                  <li>(h) Upload or transmit any content that is illegal, harmful, threatening, or otherwise objectionable.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. USER CONTENT AND DATA</h2>
                <p className="text-gray-600 mb-4">
                  The Services allow you to submit personal and sensitive information for the purpose of creating estate planning 
                  documents (&quot;User Content&quot;). You retain all ownership rights in your User Content. By submitting User Content, you 
                  grant Estate PlanPro a limited license to process your data solely for the purpose of providing the Services.
                </p>
                <p className="text-gray-600 mb-4">
                  You represent and warrant that:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>You have the right to provide the User Content you submit</li>
                  <li>Your User Content does not infringe any third party&apos;s rights</li>
                  <li>Your User Content is accurate and complete to the best of your knowledge</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  We implement industry-standard security measures including AES-256 encryption to protect your User Content. However, 
                  no method of transmission over the Internet is 100% secure. Please see our Privacy Policy for more details on how we 
                  protect your data.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. PROPRIETARY RIGHTS</h2>
                <p className="text-gray-600 mb-4">
                  Unless otherwise specified, the Services and all materials (including software and content) contained in the Services 
                  are owned by Estate PlanPro or our affiliates and/or third-party licensors. All rights not expressly granted herein 
                  are reserved.
                </p>
                <p className="text-gray-600 mb-4">
                  Estate PlanPro®, the Estate PlanPro logo, and all other Estate PlanPro product or service marks are trademarks of 
                  Estate PlanPro. All other trademarks, logos, and company names displayed on the Services are the property of their 
                  respective owners.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. DISCLAIMERS AND LIMITATIONS OF LIABILITY</h2>
                <p className="text-gray-600 mb-4 uppercase font-semibold">
                  THE SERVICES AND THEIR CONTENT ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. ESTATE PLANPRO MAKES NO 
                  REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF 
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p className="text-gray-600 mb-4 uppercase">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, ESTATE PLANPRO SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                  CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR OTHER INTANGIBLE 
                  LOSSES, RESULTING FROM YOUR USE OF THE SERVICES.
                </p>
                <p className="text-gray-600 mb-4 uppercase">
                  IN NO EVENT SHALL ESTATE PLANPRO&apos;S TOTAL LIABILITY TO YOU EXCEED THE AMOUNTS PAID BY YOU TO ESTATE PLANPRO DURING 
                  THE SIX (6) MONTHS PRECEDING THE DATE ON WHICH THE CLAIM FIRST ACCRUED.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">8. INDEMNIFICATION</h2>
                <p className="text-gray-600 mb-4">
                  You agree to defend, indemnify, and hold harmless Estate PlanPro and its directors, officers, employees, and agents 
                  from and against any and all claims, liabilities, costs, and expenses, including reasonable attorneys&apos; fees, arising 
                  from your use of the Services, your User Content, or your breach of these Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">9. DISPUTE RESOLUTION AND ARBITRATION</h2>
                <p className="text-gray-600 mb-4">
                  <strong>PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS.</strong>
                </p>
                <p className="text-gray-600 mb-4">
                  By agreeing to these Terms, you agree that any dispute, claim, or controversy arising out of or relating to these 
                  Terms or the Services shall be resolved through binding arbitration, rather than in court. You acknowledge that 
                  you are waiving the right to a trial by jury and the right to participate in a class action.
                </p>
                <p className="text-gray-600 mb-4">
                  Before initiating arbitration, you must first attempt to resolve any dispute informally by contacting us at 
                  legal@estateplanpro.com. If we are unable to resolve the dispute within 30 days, either party may initiate 
                  binding arbitration.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">10. GENERAL PROVISIONS</h2>
                
                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">10.1 Governing Law</h3>
                <p className="text-gray-600 mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without 
                  regard to its conflict of law provisions.
                </p>

                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">10.2 Severability</h3>
                <p className="text-gray-600 mb-4">
                  If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue 
                  in full force and effect.
                </p>

                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">10.3 Entire Agreement</h3>
                <p className="text-gray-600 mb-4">
                  These Terms, together with our Privacy Policy and any other agreements expressly incorporated by reference, 
                  constitute the entire agreement between you and Estate PlanPro concerning the Services.
                </p>

                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">10.4 Contact Information</h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <p className="text-gray-600 mb-4">
                  Estate PlanPro, Inc.<br />
                  Email: legal@estateplanpro.com<br />
                  Support: support@estateplanpro.com
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                By using Estate PlanPro, you acknowledge that you have read, understood, and agree to these Terms of Service.
              </p>
              <div className="mt-4 flex justify-center space-x-4">
                <Link href="/privacy" className="text-primary-600 hover:text-primary-700 text-sm">
                  Privacy Policy
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
