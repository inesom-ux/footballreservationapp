import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-800 text-white py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center md:text-left">
        <div>
          <h3 className="text-xl font-semibold mb-4">GoalTime</h3>
          <p className="text-sm text-gray-200">
            The ultimate football reservation platform — bringing players and
            stadiums together.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-200">
            <li><a href="/stadiums" className="hover:text-white">Find Stadiums</a></li>
            <li><a href="/reservations" className="hover:text-white">My Reservations</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
          <p className="text-gray-200 mb-2">Follow us on social media:</p>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="#" className="hover:text-gray-100">Facebook</a>
            <a href="#" className="hover:text-gray-100">Instagram</a>
            <a href="#" className="hover:text-gray-100">Twitter</a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-300 mt-8 text-sm">
        © {new Date().getFullYear()} GoalTime. All rights reserved.
      </div>
      <div className="text-center text-gray-300 mt-2 text-sm">
        Developed by Salah & Ines.
      </div>
    </footer>
  );
};

export default Footer;
