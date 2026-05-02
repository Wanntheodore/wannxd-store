import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '6285655834179'; // Replace with actual number
  const message = encodeURIComponent('Halo, saya ingin bertanya tentang produk di WannXd Store');
  
  return (
    <motion.a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:shadow-[0_0_40px_rgba(34,197,94,0.7)] transition-shadow duration-300"
    >
      <MessageCircle className="w-7 h-7 text-white" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
    </motion.a>
  );
};

export default WhatsAppButton;
