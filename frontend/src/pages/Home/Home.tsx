import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";


const Home: React.FC = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section
        className="h-screen flex flex-col items-center justify-center text-center bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/src/assets/test.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 max-w-2xl px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg"
          >
            Book Your Stadium. Live the Passion. ⚽
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg text-gray-100 mb-8"
          >
            Discover, reserve, and play in the best football stadiums near you.
          </motion.p>
          
          <motion.a
            href="/stadiums"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all"
          >
            Explore Stadiums
          </motion.a>
        </div>
      </section>

      {/* About / Info section */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Why Choose GoalTime?
        </h2>
        <p className="text-gray-600 mb-10 max-w-3xl mx-auto">
          We combine technology and passion to make football reservations as
          exciting as the game itself. Our mission is to connect players,
          teams, and stadiums with ease and reliability.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition-all">
            <h3 className="text-xl font-semibold text-green-700 mb-3">Fast Reservations</h3>
            <p className="text-gray-600">
              Reserve your favorite stadium in seconds. Real-time availability and instant confirmation.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition-all">
            <h3 className="text-xl font-semibold text-green-700 mb-3">Verified Stadiums</h3>
            <p className="text-gray-600">
              We partner with trusted stadiums to ensure safety, quality, and fair pricing.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition-all">
            <h3 className="text-xl font-semibold text-green-700 mb-3">Community</h3>
            <p className="text-gray-600">
              Connect with players, join teams, and relive every victory together.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
