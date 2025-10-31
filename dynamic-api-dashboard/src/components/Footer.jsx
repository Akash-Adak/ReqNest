// src/components/Footer.jsx
import { Link } from "react-router-dom";
import {
  DocumentTextIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon
} from "@heroicons/react/24/outline";

// Social media icons (since they're not available in Heroicons)
const TwitterIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const GitHubIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const LinkedInIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
  </svg>
);

const DiscordIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 01-5.922 1.618 13.728 13.728 0 00-2.884-2.56c-.360-.246-.743-.448-1.145-.607a.22.22 0 00-.118-.017 17.756 17.756 0 00-1.366.366 19.553 19.553 0 01-5.919-1.618.172.172 0 00-.188.067 19.86 19.86 0 00-2.74 10.476 19.838 19.838 0 003.257 10.082.17.17 0 00.175.074 18.836 18.836 0 005.049-1.516 14.344 14.344 0 001.33-.594.166.166 0 01.168 0 13.776 13.776 0 001.998 1.093c.777.373 1.587.68 2.417.917a.165.165 0 00.188-.067 19.875 19.875 0 002.74-10.476 19.855 19.855 0 00-3.257-10.082.172.172 0 00-.175-.074zM8.02 15.33c-1.183 0-2.157-1.12-2.157-2.443 0-1.324.95-2.443 2.157-2.443 1.208 0 2.175 1.119 2.157 2.443 0 1.323-.95 2.443-2.157 2.443zm7.975 0c-1.183 0-2.157-1.12-2.157-2.443 0-1.324.95-2.443 2.157-2.443 1.208 0 2.175 1.119 2.157 2.443 0 1.323-.95 2.443-2.157 2.443z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black pt-20 pb-8 border-t border-white/10 relative z-10">
      {/* Fixed Background Elements - Now with pointer-events-none */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-32 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-16">
          {/* Company Info - Enhanced with Logo */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center space-x-3">
                <img
                  src="/logo.png"
                  alt="ReqNest Logo"
                  className="h-12 w-12 object-contain rounded-lg bg-white/5 p-2 border border-white/10"
                />
                <div>
                  <span className="text-2xl font-black text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    ReqNest
                  </span>
                  <p className="text-xs text-green-400 font-semibold mt-1">API PLATFORM</p>
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              The complete API management platform for developers and teams. Build, test, and scale your APIs with enterprise-grade features.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-300">
                <EnvelopeIcon className="h-4 w-4 mr-3 text-green-400" />
                <span className="text-sm">hello@reqnest.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <PhoneIcon className="h-4 w-4 mr-3 text-green-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPinIcon className="h-4 w-4 mr-3 text-green-400" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: TwitterIcon, href: "#", label: "Twitter" },
                { icon: GitHubIcon, href: "#", label: "GitHub" },
                { icon: LinkedInIcon, href: "#", label: "LinkedIn" },
                { icon: DiscordIcon, href: "#", label: "Discord" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="group p-3 bg-white/5 border border-white/10 rounded-xl hover:border-green-400/30 hover:bg-green-500/10 transition-all duration-300"
                >
                  <span className="sr-only">{social.label}</span>
                  <social.icon className="h-5 w-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              Product
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Features", path: "/features" },
                { name: "Pricing", path: "/pricing" },
                { name: "Use Cases", path: "/use-cases" },
                { name: "Integrations", path: "/integrations" },
                { name: "Roadmap", path: "/roadmap" },
                { name: "Changelog", path: "/changelog" }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className="text-gray-400 hover:text-green-400 transition-all duration-200 hover:translate-x-1 flex items-center group"
                  >
                    <div className="w-1 h-1 bg-gray-600 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></div>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Documentation", path: "/docs", icon: DocumentTextIcon },
                { name: "API Reference", path: "/api-reference", icon: BookOpenIcon },
                { name: "Tutorials", path: "/tutorials" },
                { name: "Blog", path: "/blog" },
                { name: "Case Studies", path: "/case-studies" },
                { name: "Webinars", path: "/webinars" }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className="text-gray-400 hover:text-blue-400 transition-all duration-200 hover:translate-x-1 flex items-center group"
                  >
                    {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                    <div className="w-1 h-1 bg-gray-600 rounded-full mr-3 group-hover:bg-blue-400 transition-colors"></div>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Help Center", path: "/help", icon: QuestionMarkCircleIcon },
                { name: "Contact Sales", path: "/contact" },
                { name: "Status", path: "/status" },
                { name: "Community", path: "/community" },
                { name: "Partners", path: "/partners" },
                { name: "Training", path: "/training" }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className="text-gray-400 hover:text-purple-400 transition-all duration-200 hover:translate-x-1 flex items-center group"
                  >
                    {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                    <div className="w-1 h-1 bg-gray-600 rounded-full mr-3 group-hover:bg-purple-400 transition-colors"></div>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", path: "/about" },
                { name: "Careers", path: "/careers" },
                { name: "Press Kit", path: "/press" },
                { name: "Open Source", path: "/open-source" },
                { name: "Security", path: "/security" },
                { name: "Contact", path: "/contact" }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className="text-gray-400 hover:text-yellow-400 transition-all duration-200 hover:translate-x-1 flex items-center group"
                  >
                    <div className="w-1 h-1 bg-gray-600 rounded-full mr-3 group-hover:bg-yellow-400 transition-colors"></div>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-2xl p-8 mb-12 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-white font-bold text-xl mb-2">Stay Updated</h3>
              <p className="text-gray-300">Get the latest news and updates about new features and releases.</p>
            </div>
            <div className="flex space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-6">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} ReqNest Technologies. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold">All systems operational</span>
            </div>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {[
              { name: "Privacy", path: "/privacy" },
              { name: "Terms", path: "/terms" },
              { name: "Security", path: "/security" },
              { name: "Cookies", path: "/cookies" }
            ].map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;