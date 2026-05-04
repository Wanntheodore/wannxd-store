import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Shield, Clock, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Zap,
      title: 'Auto Order',
      description: 'Sistem otomatis 24/7, pesanan diproses dalam hitungan detik'
    },
    {
      icon: Shield,
      title: 'Aman & Terpercaya',
      description: 'Transaksi terenkripsi dengan validasi pembayaran real-time'
    },
    {
      icon: Clock,
      title: 'Instant Delivery',
      description: 'Produk langsung dikirim setelah pembayaran terkonfirmasi'
    }
 
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 lg:py-24">
        <div className="flex flex-col items-center text-center">
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Digital Store
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6"
          >
            <span className="gradient-text">WannXd</span>
            <span className="gradient-text">Store</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-4"
          >
            Auto Order Digital Products
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-primary font-semibold mb-12"
          >
            Cepat • Aman • 24 Jam
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/products" className="btn-neon flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5" />
              Lihat Produk
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        {/* Animated Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Mengapa Pilih <span className="gradient-text">Kami?</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Sistem terotomasi dengan keamanan tinggi dan profit terkontrol
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 text-center hover:neon-border transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 neon-glow">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 neon-border"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '1000+', label: 'Transaksi' },
              { value: '50+', label: 'Produk' },
              { value: '24/7', label: 'Operasional' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-black gradient-text mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Taglines */}
      <section className="container mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <p className="text-2xl md:text-3xl font-bold text-muted-foreground">
            "Auto Order Tercepat.."
          </p>
          <p className="text-xl text-primary font-semibold">
            "Sekali Klik, Premium Masuk."
          </p>
          <p className="text-lg gradient-text font-bold">
            Fast • Secure • Profit System
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
