import type { Metadata } from 'next'
import Link from 'next/link'
import { LandingFooter } from '@/components/landing/LandingFooter'

export const metadata: Metadata = {
  title: 'Privacy Policy — Atmos',
  description:
    'How Atmos collects, uses, and protects your data across the mobile app and web dashboard.',
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

export default function PrivacyPolicyPage() {
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
          Last updated: June 23, 2026
        </p>
        <h1 className="mt-2 font-serif text-[32px] font-semibold tracking-[-0.4px] text-text-primary">
          Privacy Policy for Atmos
        </h1>

        <p className="mt-5 text-[15px] leading-[1.65] text-text-secondary">
          Atmos (&ldquo;the App&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is
          developed by Shantnu Kumar (&ldquo;Developer&rdquo;). This Privacy Policy explains what
          data the App and its backend service (collectively, the &ldquo;Service&rdquo;) collect,
          how it is used, who it is shared with, and how you can control or delete it.
        </p>
        <p className="mt-3 text-[15px] leading-[1.65] text-text-secondary">
          By using Atmos, you agree to the practices described in this policy.
        </p>

        <div className="mt-5 rounded-[12px] border border-divider bg-white p-4 text-[14px] leading-[1.6] text-text-secondary shadow-card">
          Atmos is an independent, open-source project developed by a solo developer, not a
          company. The full source code — including the trip-detection, Gmail-parsing, and
          data-handling logic described in this policy — is publicly available at{' '}
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
          (backend) for anyone who wants to verify these practices directly.
        </div>

        <Section id="information-we-collect" title="1. Information We Collect">
          <p className="font-medium text-text-primary">1.1 Account Information</p>
          <p>
            When you register, we collect your email address and password (or, if you sign in
            with Google, your Google account ID, name, email, and profile photo), your display
            name, and a profile photo if you choose to upload one (stored via Firebase Storage).
          </p>

          <p className="font-medium text-text-primary">1.2 Location &amp; Motion Data</p>
          <p>
            To detect trips automatically, the App collects, with your explicit permission,
            precise GPS location while a trip is being detected or actively tracked, motion/activity
            signals (walking, cycling, in-vehicle) classified by your device&apos;s OS, and trip
            route waypoints used to calculate distance and transport mode. Location tracking only
            runs while detecting or recording an active trip — we do not track your location
            continuously in the background outside of that window.
          </p>

          <p className="font-medium text-text-primary">1.3 Trip &amp; Activity Data</p>
          <p>
            Transport mode, distance, duration, and timestamps for each trip you log; your home and
            work addresses if set in commute preferences; and address search queries you type when
            looking up a pickup/drop location.
          </p>

          <p className="font-medium text-text-primary">
            1.4 Gmail-Derived Trip Data (Optional Feature)
          </p>
          <p>
            If you choose to connect your Gmail account, the App requests read-only access
            (<code className="rounded bg-divider px-1.5 py-0.5 text-[13px]">gmail.readonly</code>{' '}
            scope) to your inbox, solely to detect ride-hailing and travel receipts (e.g. Uber,
            Rapido, flight bookings) and log them as trips automatically.
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              We search only for emails from known ride-hailing/travel senders — we do not read
              your general inbox content.
            </li>
            <li>
              The subject line and a stripped, plain-text version of the matching email&apos;s
              body (HTML tags, scripts, and styles removed) are sent to a third-party AI service
              (Groq) to extract structured trip details: pickup/drop address, distance, fare,
              provider, and time.
            </li>
            <li>
              <strong className="text-text-primary">
                The raw email body and Groq&apos;s response are never stored.
              </strong>{' '}
              They are processed in memory and discarded immediately after the structured fields
              are extracted and saved as a trip.
            </li>
            <li>
              We retain a lightweight log per processed email containing only the Gmail message
              ID, subject line, Gmail&apos;s short snippet (~100 characters), and a parse status
              — used for de-duplication and troubleshooting, not the email body.
            </li>
            <li>
              You can disconnect Gmail access at any time from Profile settings; this revokes our
              access token and stops further email scanning.
            </li>
          </ul>

          <p className="font-medium text-text-primary">1.5 Device &amp; Diagnostic Information</p>
          <p>
            Push notification token (Firebase Cloud Messaging) and basic device metadata (OS, app
            version) for crash diagnostics.
          </p>

          <p className="font-medium text-text-primary">1.6 Local On-Device Storage</p>
          <p>
            The App keeps a local cache of your trips on your device using an embedded SQLite
            database, so trip detection works offline before syncing to our servers. This local
            cache is deleted if you uninstall the App.
          </p>
        </Section>

        <Section id="how-we-use" title="2. How We Use Your Data">
          <p>We use the information above to:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Detect, classify, and log your trips automatically</li>
            <li>Calculate your carbon emissions (CO₂e) and show trends, streaks, and insights</li>
            <li>Resolve addresses to map coordinates and provide place-search suggestions</li>
            <li>Send push notifications about detected trips and new insights</li>
            <li>Maintain your account, preferences, and goals</li>
            <li>Diagnose crashes and improve app reliability</li>
          </ul>
          <p>
            We do not use your data for advertising, and we do not sell your personal data to
            third parties.
          </p>
        </Section>

        <Section id="third-parties" title="3. Third-Party Services We Use">
          <div className="overflow-hidden rounded-[12px] border border-divider bg-white">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-divider bg-bg-page text-text-primary">
                  <th className="px-4 py-2.5 font-semibold">Service</th>
                  <th className="px-4 py-2.5 font-semibold">What we send</th>
                  <th className="px-4 py-2.5 font-semibold">Why</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Firebase Cloud Messaging (Google)', 'Push token; trip/insight metadata', 'Push notifications'],
                  ['Firebase Storage (Google)', 'Your profile photo, if uploaded', 'Avatar hosting'],
                  ['Google Sign-In / OAuth Userinfo', 'OAuth access token', 'Authenticate you and fetch profile'],
                  ['Google Maps Geocoding & Places API', 'Searched/extracted addresses', 'Address → coordinates, autocomplete'],
                  ['Groq (AI inference)', 'Subject + stripped body of ride-receipt emails (Gmail users only)', 'Extract structured trip details'],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-divider last:border-0">
                    {row.map((cell, i) => (
                      <td key={i} className="px-4 py-2.5 align-top text-text-secondary">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            We do not share your personal data with advertisers, data brokers, or any party not
            listed above.
          </p>
        </Section>

        <Section id="security" title="4. Data Security">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>All data in transit between the App and our servers is encrypted via TLS.</li>
            <li>
              Account credentials and authentication tokens are stored using platform-secure
              storage (Android encrypted preferences / iOS Keychain-backed storage).
            </li>
            <li>
              Gmail OAuth tokens are stored encrypted and used only for the read-only scan
              described in §1.4.
            </li>
          </ul>
        </Section>

        <Section id="retention-rights" title="5. Data Retention &amp; Your Rights">
          <p>You have the right to:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong className="text-text-primary">Access your data</strong> — export your trip
              history as CSV from Profile
            </li>
            <li>
              <strong className="text-text-primary">Correct your data</strong> — edit or delete
              individual trips at any time
            </li>
            <li>
              <strong className="text-text-primary">Delete your account</strong> — in-app via
              Profile → Account → Delete Account. Your account enters a 7-day grace period during
              which you can log back in to cancel the deletion. After 7 days, your profile,
              preferences, trip history, and Gmail connection are permanently and irreversibly
              erased.
            </li>
            <li>
              <strong className="text-text-primary">Disconnect Gmail</strong> — independently of
              account deletion, via Profile → Gmail
            </li>
            <li>
              <strong className="text-text-primary">Withdraw location/motion permission</strong> —
              at any time via device settings, which disables automatic trip detection only
            </li>
          </ul>
        </Section>

        <Section id="children" title="6. Children's Privacy">
          <p>
            Atmos is not directed at children under 13, and we do not knowingly collect personal
            data from children under 13. If you believe a child has provided us data, contact us
            and we will delete it.
          </p>
        </Section>

        <Section id="changes" title="7. Changes to This Policy">
          <p>
            We may update this policy from time to time. Material changes will be reflected by
            updating the &ldquo;Last updated&rdquo; date above, and significant changes will be
            communicated in-app.
          </p>
        </Section>

        <Section id="contact" title="8. Contact Us">
          <p>For privacy questions, data requests, or concerns:</p>
          <p>
            <strong className="text-text-primary">Developer:</strong> Shantnu Kumar
            <br />
            <strong className="text-text-primary">Email:</strong>{' '}
            <a href="mailto:connect2shantnu@gmail.com" className="font-medium text-horizon-blue hover:underline">
              connect2shantnu@gmail.com
            </a>
          </p>
        </Section>
      </main>

      <LandingFooter />
    </div>
  )
}
