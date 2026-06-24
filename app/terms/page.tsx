import type { Metadata } from 'next'
import Link from 'next/link'
import { LandingFooter } from '@/components/landing/LandingFooter'

export const metadata: Metadata = {
  title: 'Terms of Service — Atmos',
  description: 'The terms that govern your use of Atmos, the carbon-tracking app and dashboard.',
}

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="mt-10">
      <h2 className="font-serif text-[20px] font-semibold tracking-[-0.2px] text-text-primary">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-[1.65] text-text-secondary">
        {children}
      </div>
    </section>
  )
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-bg-page antialiased">
      {/* Minimal top bar — not the full landing nav, since anchor links don't apply here */}
      <nav className="border-b border-divider bg-white/80 backdrop-blur-md backdrop-saturate-150">
        <div className="mx-auto flex h-[68px] max-w-[760px] items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-[10px]">
            <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-gradient-to-br from-horizon-blue to-sage text-[17px] font-bold leading-none text-white">
              a
            </span>
            <span className="text-[18px] font-semibold tracking-[-0.3px] text-text-primary">
              atmos
            </span>
          </Link>
          <Link
            href="/"
            className="text-[14px] font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Back to home
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-[760px] px-5 py-14">
        <p className="text-[13px] font-medium uppercase tracking-[0.4px] text-text-secondary">
          Last updated: June 25, 2026
        </p>
        <h1 className="mt-2 font-serif text-[32px] font-semibold tracking-[-0.4px] text-text-primary">
          Terms of Service for Atmos
        </h1>

        <p className="mt-5 text-[15px] leading-[1.65] text-text-secondary">
          Atmos (&ldquo;the App&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is
          developed by Shantnu Kumar (&ldquo;Developer&rdquo;). These Terms of Service
          (&ldquo;Terms&rdquo;) govern your access to and use of the App and its backend service
          (collectively, the &ldquo;Service&rdquo;).
        </p>
        <p className="mt-3 text-[15px] leading-[1.65] text-text-secondary">
          By creating an account or otherwise using Atmos, you agree to these Terms. If you do not
          agree, do not use the Service.
        </p>

        <div className="mt-5 rounded-[12px] border border-divider bg-white p-4 text-[14px] leading-[1.6] text-text-secondary shadow-card">
          Atmos is an independent, open-source project developed by a solo developer, not a
          company. The full source code is publicly available at{' '}
          <a
            href="https://github.com/dipu989/atmos-mobile"
            className="font-medium text-horizon-blue hover:underline"
          >
            github.com/dipu989/atmos-mobile
          </a>{' '}
          (app) and{' '}
          <a
            href="https://github.com/dipu989/atmos-core"
            className="font-medium text-horizon-blue hover:underline"
          >
            github.com/dipu989/atmos-core
          </a>{' '}
          (backend). See our{' '}
          <Link href="/privacy" className="font-medium text-horizon-blue hover:underline">
            Privacy Policy
          </Link>{' '}
          for how we handle your data.
        </div>

        <Section id="acceptance" title="1. Acceptance of Terms">
          <p>
            You must be at least 13 years old to use Atmos. By using the Service, you confirm
            that you meet this requirement and that you have the legal capacity to agree to these
            Terms.
          </p>
        </Section>

        <Section id="description" title="2. Description of Service">
          <p>
            Atmos automatically detects trips using your device&apos;s location and motion
            signals, calculates the associated carbon emissions, and lets you review, edit, and
            track this activity over time. Features may change, and we may add, modify, or remove
            functionality at any time.
          </p>
        </Section>

        <Section id="accounts" title="3. Account Responsibilities">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>You are responsible for keeping your login credentials confidential.</li>
            <li>You are responsible for all activity that occurs under your account.</li>
            <li>
              Notify us promptly at{' '}
              <a
                href="mailto:connect2shantnu@gmail.com"
                className="font-medium text-horizon-blue hover:underline"
              >
                connect2shantnu@gmail.com
              </a>{' '}
              if you suspect unauthorized access to your account.
            </li>
            <li>
              You are responsible for the accuracy of any information you manually enter, such as
              home/work addresses or edited trip details.
            </li>
          </ul>
        </Section>

        <Section id="acceptable-use" title="4. Acceptable Use">
          <p>You agree not to:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Use the Service for any unlawful purpose or in violation of any applicable law.</li>
            <li>
              Attempt to gain unauthorized access to the Service, other users&apos; accounts, or
              the systems supporting it.
            </li>
            <li>Interfere with or disrupt the integrity or performance of the Service.</li>
            <li>
              Reverse-engineer, decompile, or attempt to extract the source code of the Service,
              except where the source is already published under its open-source license.
            </li>
          </ul>
        </Section>

        <Section id="ip" title="5. Intellectual Property">
          <p>
            The Atmos source code is open-source and available at the repositories linked above
            under their respective licenses. The Atmos name, logo, and branding are not covered by
            that license and remain the property of the Developer. Your trip data and any content
            you create remains yours.
          </p>
        </Section>

        <Section id="disclaimers" title="6. Disclaimers &amp; Limitation of Liability">
          <p>
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without
            warranties of any kind, express or implied. Trip detection, distance, and emissions
            calculations are estimates based on device sensors and third-party data, and may be
            inaccurate or incomplete.
          </p>
          <p>
            To the fullest extent permitted by law, the Developer is not liable for any indirect,
            incidental, or consequential damages arising from your use of, or inability to use,
            the Service.
          </p>
        </Section>

        <Section id="termination" title="7. Termination">
          <p>
            You may stop using the Service and delete your account at any time via Profile →
            Account → Delete Account. We may suspend or terminate access to the Service if you
            violate these Terms.
          </p>
        </Section>

        <Section id="changes" title="8. Changes to These Terms">
          <p>
            We may update these Terms from time to time. Material changes will be reflected by
            updating the &ldquo;Last updated&rdquo; date above, and significant changes will be
            communicated in-app. Continued use of the Service after changes take effect
            constitutes acceptance of the revised Terms.
          </p>
        </Section>

        <Section id="governing-law" title="9. Governing Law">
          <p>
            These Terms are governed by the laws of India, without regard to conflict-of-law
            principles, unless otherwise required by the law of your jurisdiction.
          </p>
        </Section>

        <Section id="contact" title="10. Contact Us">
          <p>For questions about these Terms:</p>
          <p>
            <strong className="text-text-primary">Developer:</strong> Shantnu Kumar
            <br />
            <strong className="text-text-primary">Email:</strong>{' '}
            <a
              href="mailto:connect2shantnu@gmail.com"
              className="font-medium text-horizon-blue hover:underline"
            >
              connect2shantnu@gmail.com
            </a>
          </p>
        </Section>
      </main>

      <LandingFooter />
    </div>
  )
}
