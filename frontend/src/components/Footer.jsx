import React from 'react';
import { Vote, Twitter, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  const socialLinks = [
    { icon: Twitter, href: '#' },
    { icon: Linkedin, href: '#' },
    { icon: Github, href: '#' },
  ];

  const footerLinks = [
    { title: 'About Us', href: '#' },
    { title: 'Contact', href: '#' },
    { title: 'Privacy Policy', href: '#' },
    { title: 'Terms of Service', href: '#' },
  ];

  return (
    <footer className="bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Vote className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-wide">MULTI-ELECT</h1>
            </Link>
            <p className="text-gray-200">
              Secure, transparent, and accessible voting for everyone.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a key={index} href={link.href} className="text-gray-200 hover:text-red-400 transition-colors">
                  <link.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {footerLinks.slice(0, 2).map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-gray-200 hover:text-red-400 transition-colors">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.slice(2, 4).map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-gray-200 hover:text-red-400 transition-colors">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-gray-200">Subscribe to our newsletter to get the latest updates.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded-l-lg focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg font-semibold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center text-gray-200">
          <p>&copy; {new Date().getFullYear()} Multi-Elect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
