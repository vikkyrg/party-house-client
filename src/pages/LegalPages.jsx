import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import { motion, AnimatePresence } from 'framer-motion';

export function ContactPage() {
  return null; // Note: ContactPage is now exported from its own file.
}

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const { data: faqsRes, isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => contentService.getFaqs(),
  });

  const faqs = faqsRes?.data || [];

  const defaultFaqs = [
    { question: 'What is RIO PARTY HOUSE?', answer: 'RIO PARTY HOUSE provides private celebration and entertainment spaces that customers can reserve for birthdays, anniversaries, date nights, parties, movie experiences, and other special occasions.' },
    { question: 'How do I book a room?', answer: 'Choose a theater, select a room, choose your preferred date, select an available time slot, provide the required booking details, and complete the payment process.' },
    { question: 'Can I choose a specific room?', answer: 'Yes. Available rooms are displayed under the selected theater, subject to availability.' },
    { question: 'Can I choose my preferred time?', answer: 'Yes. Each room may have its own configured time slots. Only available time slots for the selected date can be booked.' },
    { question: 'What happens when a time slot is already booked?', answer: 'That time slot is shown as unavailable and cannot be booked by another customer for the same room and date.' },
    { question: 'Can I book for birthdays or anniversaries?', answer: 'Yes. RIO PARTY HOUSE spaces can be used for birthdays, anniversaries, date nights, parties, movie experiences, and other celebrations, subject to the facilities available at the selected venue.' },
    { question: 'Can I add cakes, food, decorations, or other services?', answer: 'Additional services may be available depending on the selected venue. Available add-ons and services will be shown where applicable.' },
    { question: 'Can I cancel my booking?', answer: 'Cancellation eligibility depends on the applicable cancellation and refund terms for your booking. Please review the Refund Policy before completing your reservation.' },
    { question: 'How will I receive my booking confirmation?', answer: 'After successful booking and payment verification, your booking confirmation and relevant booking information will be provided through the contact details supplied during the booking process.' },
    { question: 'How can I contact RIO PARTY HOUSE?', answer: 'Use the Contact Us page or the official contact details provided on the website.' },
  ];

  const faqList = faqs.length > 0 ? faqs : defaultFaqs;

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 relative overflow-hidden font-sans">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl relative z-10">
        <h1 className="text-[40px] md:text-[48px] font-heading text-[#1a1c21] font-extrabold mb-12 text-center leading-tight">
          FAQs
        </h1>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center p-8 text-[#6b5c52] font-medium">Loading FAQs...</div>
          ) : faqList.length > 0 ? (
            faqList.map((faq, i) => (
              <div key={faq._id || i} className="bg-white rounded-[16px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#f0e6dd] overflow-hidden">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-[16px] md:text-[18px] font-bold text-[#1a1c21] pr-8">{faq.question}</h3>
                  <div className="shrink-0 text-[#1a1c21]">
                    {openIndex === i ? (
                      <ArrowUp className="w-5 h-5" strokeWidth={2} />
                    ) : (
                      <ArrowDown className="w-5 h-5" strokeWidth={2} />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 pt-2">
                        <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.6]">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="text-center p-8 text-[#6b5c52] font-medium bg-white rounded-[24px] border border-[#f0e6dd]">
              No FAQs available at the moment.
            </div>
          )}
        </div>

        <div className="mt-16 text-center p-8 bg-[#f4e6d9] rounded-[24px] border border-[#eaddd0]">
          <h3 className="text-[20px] font-bold mb-2 text-[#1a1c21]">Still have questions?</h3>
          <p className="text-[14px] font-medium text-[#6b5c52] mb-6">Can't find the answer you're looking for? Please contact our team.</p>
          <Link to="/contact" className="inline-flex items-center justify-center px-6 h-12 bg-[#9e6223] text-white font-bold text-[14px] rounded-[16px] hover:bg-[#7a4b1b] transition-colors">
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 relative font-sans">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10">
        <h1 className="text-[40px] md:text-[48px] font-heading text-[#1a1c21] font-extrabold mb-8 text-center">Terms & Conditions</h1>
        <div className="bg-white p-8 md:p-12 rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#f0e6dd]">
          <p className="text-[13px] font-bold text-[#8c5211] mb-8 uppercase tracking-widest">Last updated: [DATE TO BE CONFIRMED]</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">1. Introduction</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">These Terms & Conditions govern the use of the RIO PARTY HOUSE website and the booking of private celebration spaces and entertainment experiences offered through the platform.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">2. Use of the Website</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">Customers may use the website to discover available theaters, view room information, and make bookings for private experiences. Use of the website must comply with applicable law and the booking terms provided at the time of reservation.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">3. Customer Eligibility</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">The website is intended for customers who are legally able to enter into binding agreements and who are booking spaces for lawful personal or private celebration purposes.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">4. Account / Customer Information</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">Customers are responsible for providing accurate contact and booking information. Information may be used to confirm reservations, communicate updates, and provide support.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">5. Booking Process</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">Customers are responsible for selecting the correct theater, room, date, time slot, and number of guests before completing a booking.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">6. Theater and Room Availability</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">A time slot is considered unavailable once it has been successfully reserved or booked according to the booking system. Availability displayed on the website may change until the booking is successfully confirmed.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">7. Booking Confirmation</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">Payment must be successfully completed and verified for a booking to be confirmed. A confirmed booking is subject to the applicable venue and booking terms.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">8. Pricing and Taxes</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">Pricing, taxes, and additional charges, where applicable, will be displayed during the booking flow before payment is completed. Customers should review the final amount before confirming the transaction.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">9. Payment</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">Payments may be processed through third-party payment providers. A booking is not considered confirmed until the payment has been successfully completed and verified.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">10. Cancellation and Refunds</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">Cancellation eligibility and refund treatment depend on the booking terms and the applicable venue policies. Please review the Cancellation & Refund Policy before finalising a reservation.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">11. Customer Responsibilities</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">Customers are responsible for providing accurate contact and booking information and for ensuring that bookings are made in accordance with venue and event requirements.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">12. Venue Rules</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">Customers are expected to follow any venue-specific rules communicated by the relevant theater or venue operator during the booking and experience.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">13. Prohibited Activities</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">Customers must not use the website or venue facilities for unlawful, abusive, disruptive, or harmful purposes, or in a manner that interferes with the safety, access, or enjoyment of others.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">14. Third-Party Services</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">RIO PARTY HOUSE may rely on third-party technology and payment providers to support bookings, payments, and website functionality. These services are subject to their own terms and privacy policies.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">15. Intellectual Property</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">All website content, branding, design, and materials are proprietary to RIO PARTY HOUSE or its licensors and may not be used without prior written authorisation.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">16. Website Availability</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">RIO PARTY HOUSE attempts to maintain the website and booking platform to a high standard, but availability may be interrupted due to maintenance, technical issues, or events outside its reasonable control.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">17. Limitation of Liability</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">RIO PARTY HOUSE shall not be liable for indirect, incidental, or consequential losses arising from the use of the website or booking process, except to the extent required by applicable law.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">18. Changes to Services</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">RIO PARTY HOUSE may change, suspend, or discontinue any service or website feature at any time, subject to applicable terms and customer communications where required.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">19. Changes to Terms</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">RIO PARTY HOUSE may update these Terms & Conditions from time to time. Customers are encouraged to review the latest version before making bookings.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">20. Governing Law / Jurisdiction</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">These terms are governed by the laws of [JURISDICTION / GOVERNING LAW TO BE CONFIRMED]. Any disputes arising in connection with the website or bookings will be subject to the jurisdiction of the relevant courts in that location.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">21. Contact Information</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-8">For questions regarding these terms or your booking, please use the official contact details available on the Contact Us page or on the website.</p>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 relative font-sans">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10">
        <h1 className="text-[40px] md:text-[48px] font-heading text-[#1a1c21] font-extrabold mb-8 text-center">Privacy Policy</h1>
        <div className="bg-white p-8 md:p-12 rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#f0e6dd]">
          <p className="text-[13px] font-bold text-[#8c5211] mb-8 uppercase tracking-widest">Last updated: [DATE TO BE CONFIRMED]</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">We collect personal information that you provide directly to us, including your name, phone number, email address, booking information, theater or room selection, date and time-slot preference, guest count, payment transaction information, and customer support communications.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">We use this information to process bookings, confirm reservations, process payments, verify transactions, maintain room and time-slot availability, provide customer support, send booking-related communications, improve website functionality, prevent fraud or misuse, and comply with applicable legal requirements.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">3. Payment Information</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">Payments may be processed through third-party payment providers such as Razorpay. RIO PARTY HOUSE does not intentionally store complete card credentials, CVV, UPI PINs, or banking passwords on its application servers.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">4. Cookies and Tracking</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">We may use cookies or similar technologies to improve website performance, remember preferences, understand user behavior, and support account or booking-related functionality.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">5. Data Security</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">We implement reasonable administrative, technical, and organizational measures to protect personal data from loss, misuse, unauthorised access, or disclosure. No system can be guaranteed to be completely secure.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">6. Data Retention</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">We retain personal information only for as long as needed to fulfil the purposes for which it was collected, comply with legal obligations, resolve disputes, and enforce agreements.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">7. Third-Party Services</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">RIO PARTY HOUSE may use service providers such as payment gateways, customer support tools, analytics tools, hosting infrastructure, and other website-related services to operate the platform. These services may process data in accordance with their own privacy terms.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">8. Customer Rights and Requests</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">Customers may contact us to request information about their personal data, ask for corrections, or raise concerns regarding data use, subject to applicable law and verification requirements.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">9. Children’s Privacy</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">RIO PARTY HOUSE does not knowingly collect or maintain personal information from children without appropriate parental or guardian consent where required by applicable law.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">10. Policy Updates</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">This Privacy Policy may be updated from time to time. Where required, changes will be reflected in the document and communicated through the website or booking process.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">11. Contact Information</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-8">For privacy questions or requests, please contact the official RIO PARTY HOUSE support or contact details available on the website.</p>
        </div>
      </div>
    </div>
  );
}
