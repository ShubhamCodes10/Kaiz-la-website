'use client';

import React from 'react';

export default function TermsAndConditionsPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Terms and Conditions
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Last updated: {currentDate}
          </p>
        </div>

        <div className="space-y-8 prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:text-foreground prose-a:text-primary hover:prose-a:underline">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to Kaiz La ("Company", "we", "our", "us")! These Terms and Conditions ("Terms") govern your use of our website and the services offered, including the KaiExpert chatbot. By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
            </p>
          </section>

          <section>
            <h2>2. User Responsibilities</h2>
            <p>
              You agree to use our services for lawful purposes only. You are responsible for ensuring that any information you provide through our chatbot, including contact details and business requirements, is accurate and that you have the authority to share it.
            </p>
          </section>

          <section>
            <h2>3. Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality are and will remain the exclusive property of Kaiz La and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Kaiz La.
            </p>
          </section>

          <section>
            <h2>4. Limitation of Liability</h2>
            <p>
              In no event shall Kaiz La, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>
          </section>

          <section>
            <h2>5. Disclaimer</h2>
            <p>
              Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. The service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
            </p>
          </section>
          
          <section>
            <h2>6. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the company is based, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2>7. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>
          
          <section>
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us through the official channels provided on our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}