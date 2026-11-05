'use client';

import { useState } from 'react';
import { submitContactFormAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';

interface ContactClientProps {
  locale: 'bn' | 'en';
}

export function ContactClient({ locale }: ContactClientProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBn = locale === 'bn';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg(isBn ? 'আপনার নাম লিখুন' : 'Name is required');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(isBn ? 'সঠিক ইমেল ঠিকানা লিখুন' : 'Valid email is required');
      return;
    }

    if (!message.trim()) {
      setErrorMsg(isBn ? 'বার্তা বা বক্তব্য লিখুন' : 'Message is required');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (phone) formData.append('phone', phone);
    formData.append('message', message);

    const res = await submitContactFormAction(formData);

    if (!res.success) {
      setErrorMsg(res.error || (isBn ? 'বার্তা পাঠাতে সমস্যা হয়েছে' : 'Failed to send message'));
    } else {
      setSuccessMsg(
        res.message ||
          (isBn
            ? 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে! শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।'
            : 'Your message has been sent successfully!')
      );
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-200 shadow-card">
      <h2 className="text-2xl font-bold text-surface-900 mb-2">
        {isBn ? 'আমাদের বার্তা পাঠান' : 'Send Us a Message'}
      </h2>
      <p className="text-sm text-surface-600 mb-6">
        {isBn
          ? 'আপনার কোনো প্রশ্ন, পরামর্শ বা মতামত থাকলে নিচের ফর্মে লিখে জানান।'
          : 'Feel free to reach out with any questions, suggestions, or feedback.'}
      </p>

      {errorMsg && <Alert variant="danger" title={isBn ? 'ত্রুটি' : 'Error'} className="mb-4">{errorMsg}</Alert>}
      {successMsg && <Alert variant="success" title={isBn ? 'ধন্যবাদ' : 'Success'} className="mb-4">{successMsg}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={isBn ? 'আপনার নাম (Your Name) *' : 'Your Name *'}
          placeholder={isBn ? 'যেমন: সুজিত সরকার' : 'John Doe'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={isBn ? 'ইমেল (Email Address) *' : 'Email Address *'}
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label={isBn ? 'ফোন নম্বর (Phone Number)' : 'Phone Number'}
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <Textarea
          label={isBn ? 'আপনার বক্তব্য / বার্তা (Your Message) *' : 'Your Message *'}
          placeholder={isBn ? 'এখানে আপনার বার্তাটি লিখুন...' : 'Write your message here...'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
        />

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting
            ? isBn
              ? 'পাঠানো হচ্ছে...'
              : 'Sending...'
            : isBn
            ? 'বার্তা পাঠান (Send Message)'
            : 'Send Message'}
        </Button>
      </form>
    </div>
  );
}
