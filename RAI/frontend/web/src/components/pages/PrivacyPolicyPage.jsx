import LegalLayout from "../layout/LegalLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="Effective Date: May 14, 2026">
      <p>
        Welcome to <strong>Gymmer</strong>. We are committed to protecting your personal information and your right to privacy. 
        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our application.
      </p>

      <h3 className="text-lg text-[var(--text-primary)] font-semibold mt-4">1. Information We Collect</h3>
      <p>We collect personal information that you voluntarily provide to us when you register on the App, express an interest in obtaining information about us or our products and services, or otherwise contact us. The personal information that we collect depends on the context of your interactions with us and the App. The personal information we collect may include the following:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Account Information:</strong> Name, email address, password, and social login data (Apple, Google).</li>
        <li><strong>Health and Fitness Data:</strong> Height, weight, age, gender, macronutrient goals, workout routines, lifting logs, and dietary preferences required to provide our core services.</li>
        <li><strong>Usage Data:</strong> Information about how you interact with our application, including timestamps, feature usage, and device information.</li>
      </ul>

      <h3 className="text-lg text-[var(--text-primary)] font-semibold mt-4">2. How We Use Your Information</h3>
      <p>We use personal information collected via our App for a variety of business purposes described below:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>To facilitate account creation and logon process.</li>
        <li>To calculate and track your macro/micro nutrient targets and workout progression.</li>
        <li>To send you administrative information, such as updates to our terms, conditions, and policies.</li>
        <li>To protect our Services. We may use your information as part of our efforts to keep our App safe and secure (for example, for fraud monitoring and prevention).</li>
      </ul>

      <h3 className="text-lg text-[var(--text-primary)] font-semibold mt-4">3. Will Your Information Be Shared?</h3>
      <p>
        We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. 
        <strong> We do not sell your personal or health data to third-party advertisers.</strong> We may share data with third-party vendors, service providers, or contractors who perform services for us or on our behalf and require access to such information to do that work (e.g., secure cloud hosting providers).
      </p>

      <h3 className="text-lg text-[var(--text-primary)] font-semibold mt-4">4. How Long Do We Keep Your Information?</h3>
      <p>
        We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law. When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information.
      </p>

      <h3 className="text-lg text-[var(--text-primary)] font-semibold mt-4">5. How Do We Keep Your Information Safe?</h3>
      <p>
        We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
      </p>

      <h3 className="text-lg text-[var(--text-primary)] font-semibold mt-4">6. Your Privacy Rights</h3>
      <p>
        You have the right to request access to the personal data we collect from you, change that information, or delete it in some circumstances. To request to review, update, or delete your personal information, please use the account settings within the Gymmer app or contact us directly.
      </p>

      <h3 className="text-lg text-[var(--text-primary)] font-semibold mt-4">7. Contact Us</h3>
      <p>
        If you have questions or comments about this notice, you may email us at <strong>privacy@gymmer.com</strong>.
      </p>
    </LegalLayout>
  );
}