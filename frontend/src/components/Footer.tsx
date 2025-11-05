import React from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 border-t border-emerald-800/50 text-white relative overflow-hidden">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
      
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-600 rounded-full blur-3xl pointer-events-none"
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              GoalTime
            </h3>
            <p className="text-emerald-100/80 text-sm leading-relaxed">
              The ultimate football reservation platform — bringing players and stadiums together.
            </p>
            <div className="flex gap-3 pt-2">
              {[
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Twitter, href: "#", label: "Twitter" },
              ].map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-emerald-800/50 border border-emerald-700/50 flex items-center justify-center hover:border-emerald-500 hover:bg-emerald-700/50 transition-all group"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4 text-emerald-300 group-hover:text-emerald-400 transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6 text-emerald-300">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Find Stadiums", to: "/stadiums" },
                { label: "My Reservations", to: "/reservations" },
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/contact" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-emerald-100/70 hover:text-emerald-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-emerald-400 group-hover:w-4 transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6 text-emerald-300">Contact</h4>
            <ul className="space-y-4">

              {/* Mail contact */}
              <li className="flex items-start gap-3 text-sm text-emerald-100/70">
                <div className="w-8 h-8 rounded-lg bg-emerald-800/50 border border-emerald-700/50 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-emerald-400" />
                </div>
                <a
                  href="mailto:support@goaltime.com"
                  className="mt-1 text-emerald-100/70 hover:text-emerald-400 transition-colors"
                >
                  support@goaltime.com
                </a>
              </li>

              {/* Phone contact */}
              <li className="flex items-start gap-3 text-sm text-emerald-100/70">
                <div className="w-8 h-8 rounded-lg bg-emerald-800/50 border border-emerald-700/50 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="mt-1">+33 7 53 82 18 98</span>
              </li>

              {/* Location */}
              <li className="flex items-start gap-3 text-sm text-emerald-100/70">
                <div className="w-8 h-8 rounded-lg bg-emerald-800/50 border border-emerald-700/50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <a
                  href="https://www.google.com/maps/place/Faculty+of+Science+and+Technology/@48.6651253,6.1585498,483m/data=!3m3!1e3!4b1!5s0x4794a2779d8b709b:0x1a2cb139e2eb0c2f!4m6!3m5!1s0x4794a2777ca326cd:0x6a1a9d235b3c7d72!8m2!3d48.6651218!4d6.1611247!16s%2Fg%2F1tdbvpgn?entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-emerald-100/70 hover:text-emerald-400 transition-colors"
                >
                  FST Lorraine, Nancy, France
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-6 text-emerald-300">Stay Updated</h4>
            <p className="text-emerald-100/70 text-sm mb-4">
              Get the latest updates on new stadiums and features.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-emerald-900/30 border border-emerald-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-emerald-300/50 focus:outline-none focus:border-emerald-500 focus:bg-emerald-900/50 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl text-sm font-semibold text-white hover:from-emerald-500 hover:to-emerald-600 transition-all shadow-lg shadow-emerald-900/50"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-700/50 to-transparent mb-8" />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-emerald-100/60"
        >
          <p>© {new Date().getFullYear()} GoalTime. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </a>
          </div>

          <p className="text-emerald-200/50">
            Developed by <span className="text-emerald-400 font-semibold">Salah & Ines</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;