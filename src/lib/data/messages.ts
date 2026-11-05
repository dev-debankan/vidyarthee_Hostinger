import { getSiteSettings } from './settings';
import type { LeadershipMessage } from '@/types';

export async function getLeadershipMessages(): Promise<LeadershipMessage[]> {
  const settings = await getSiteSettings();

  const presidentMsg: LeadershipMessage = {
    id: 'msg-pres',
    role: 'president',
    name_bn: settings['president_name_bn'] || settings['president_name'] || 'অরুণ কুমার সেন',
    name_en: settings['president_name_en'] || 'Arun Kumar Sen',
    title_bn: settings['president_title_bn'] || 'সভাপতির বার্তা',
    title_en: settings['president_title_en'] || "President's Message",
    excerpt_bn:
      settings['president_excerpt_bn'] ||
      '১৯৮৭ সাল থেকে শিমুরালি ও পার্শ্ববর্তী এলাকার দরিদ্র ও মেধাবী ছাত্রছাত্রীদের পাশে দাঁড়ানোই আমাদের মূল অঙ্গীকার।',
    excerpt_en:
      settings['president_excerpt_en'] ||
      'Since 1987, our primary commitment has been to support underprivileged and talented students of Simurali and surrounding areas.',
    full_message_bn:
      settings['president_full_bn'] ||
      '১৯৮৭ সালে স্থাপিত বিদ্যার্থী ফ্রি কোচিং সেন্টার কেবল একটি শিক্ষাপ্রতিষ্ঠান নয়, এটি একটি সামাজিক আন্দোলন। সমাজের সর্বস্তরের মানুষের সহযোগিতা ও স্বেচ্ছাসেবকদের নিরলস পরিশ্রমে আজ আমরা শিক্ষা, স্বাস্থ্য ও সংস্কৃতির ক্ষেত্রে সেবা পৌঁছে দিতে পারছি। আমাদের মূল উদ্দেশ্য কোনো শিশু যেন অর্থের অভাবে শিক্ষা থেকে বঞ্চিত না হয়।',
    full_message_en:
      settings['president_full_en'] ||
      'Established in 1987, Bidyarthi Free Coaching Centre is not merely an educational institution; it is a community movement. Through the cooperation of society and the dedicated efforts of our volunteers, we continue to deliver education, health, and cultural services. Our goal is to ensure no child is deprived of education due to financial constraints.',
    image_url: settings['president_image_url'] || undefined,
  };

  const secretaryMsg: LeadershipMessage = {
    id: 'msg-sec',
    role: 'secretary',
    name_bn: settings['secretary_name_bn'] || settings['secretary_name'] || 'বরুণ চন্দ্র দে',
    name_en: settings['secretary_name_en'] || 'Barun Chandra Dey',
    title_bn: settings['secretary_title_bn'] || 'সম্পাদকের বার্তা',
    title_en: settings['secretary_title_en'] || "Secretary's Message",
    excerpt_bn:
      settings['secretary_excerpt_bn'] ||
      'ফ্রি কোচিং থেকে বিনামূল্যে অ্যাম্বুলেন্স পরিষেবা — সমাজের প্রতিটি মানুষের সামাজিক সুরক্ষায় আমরা প্রতিশ্রুতিবদ্ধ।',
    excerpt_en:
      settings['secretary_excerpt_en'] ||
      'From free coaching to emergency ambulance service — we are dedicated to providing social welfare to every member of our community.',
    full_message_bn:
      settings['secretary_full_bn'] ||
      'আমাদের কোচিং সেন্টারে বর্তমানে অভিজ্ঞ শিক্ষকদের মাধ্যমে পঞ্চম থেকে দশম শ্রেণী পর্যন্ত বিনামূল্যে মানসম্মত শিক্ষা প্রদান করা হচ্ছে। পাশাপাশি ছাত্র পাঠাগার, হোমিওপ্যাথি চিকিৎসালয় এবং ২৪x৭ অ্যাম্বুলেন্স সেবা পরিচালিত হচ্ছে। আপনাদের সার্বিক সহায়তা আমাদের এগিয়ে চলার অনুপ্রেরণা।',
    full_message_en:
      settings['secretary_full_en'] ||
      'At our coaching centre, we currently provide quality free education from Class V to X through experienced teachers. Alongside this, our student library, homeopathic dispensary, and 24x7 ambulance service remain active. Your constant support inspires us to move forward.',
    image_url: settings['secretary_image_url'] || undefined,
  };

  return [presidentMsg, secretaryMsg];
}
