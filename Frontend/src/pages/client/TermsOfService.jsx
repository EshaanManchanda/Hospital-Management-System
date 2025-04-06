import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-hospital-primary">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: April 5, 2024</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p className="mb-4">
          Welcome to Hospital Management System. These Terms of Service ("Terms") govern your access to and use of our website, services, and applications (collectively, the "Services").
        </p>
        <p>
          By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Use of Services</h2>
        <p className="mb-4">You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the Services in any way that violates any applicable federal, state, local, or international law or regulation</li>
          <li>Impersonate or attempt to impersonate the Hospital Management System, an employee, another user, or any other person or entity</li>
          <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Services</li>
          <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Services</li>
          <li>Use the Services in any manner that could disable, overburden, damage, or impair the site</li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
        <p className="mb-4">
          When you create an account with us, you must provide accurate, complete, and up-to-date information. You are responsible for safeguarding your account credentials and for any activities or actions under your account.
        </p>
        <p>
          We reserve the right to disable any user account at any time in our sole discretion for any or no reason, including if we believe that you have violated these Terms.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property Rights</h2>
        <p className="mb-4">
          The Services and their entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by Hospital Management System, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
        </p>
        <p>
          These Terms do not grant you any rights to use the Hospital Management System's name, logo, or other trademarks.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Disclaimer of Warranties</h2>
        <p className="mb-4">
          The Services are provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied. Neither Hospital Management System nor any person associated with Hospital Management System makes any warranty or representation with respect to the completeness, security, reliability, quality, accuracy, or availability of the Services.
        </p>
        <p>
          The foregoing does not affect any warranties that cannot be excluded or limited under applicable law.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by applicable law, in no event will Hospital Management System, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the Services, including any direct, indirect, special, incidental, consequential, or punitive damages.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms of Service</h2>
        <p>
          We may revise and update these Terms from time to time at our sole discretion. All changes are effective immediately when we post them, and apply to all access to and use of the Services thereafter.
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
        <p>
          Questions or comments about the Services or these Terms may be directed to our support team at support@hospitalmanagementsystem.com or by calling us at (555) 123-4567.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
