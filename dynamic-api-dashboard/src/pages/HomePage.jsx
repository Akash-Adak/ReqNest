// src/pages/Homepage.jsx
import { Link } from "react-router-dom";
import { 
  ArrowRightIcon, 
  ShieldCheckIcon, 
  BoltIcon, 
  ChartBarIcon,
  ServerIcon,
  CodeBracketIcon,
  CloudIcon,
  ArrowTopRightOnSquareIcon,
  CpuChipIcon,
  DocumentTextIcon,
  LockClosedIcon,
  CommandLineIcon
} from "@heroicons/react/24/solid";

export default function Homepage() {
  return (
    <div className="bg-gray-50 text-gray-900">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              API Management <span className="block text-yellow-300 mt-2">Made Effortless</span>
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto leading-relaxed">
              Build, test, and scale your APIs with the most intuitive platform. 
              Schema validation, automated testing, and real-time monitoring in one place.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/apis"
                className="px-8 py-4 bg-yellow-400 text-gray-900 font-semibold rounded-xl shadow-lg hover:bg-yellow-300 transition-all transform hover:-translate-y-1 flex items-center justify-center"
              >
                Start Building Now
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/demo"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white text-white font-semibold rounded-xl hover:bg-white/20 transition-all flex items-center justify-center"
              >
                Watch Demo
                <ArrowTopRightOnSquareIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
            
            <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto border border-white/20">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>99.9% Uptime SLA</span>
                </div>
                <div className="hidden sm:block">•</div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>Schema Validation</span>
                </div>
                <div className="hidden sm:block">•</div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>Real-time Testing</span>
                </div>
                <div className="hidden sm:block">•</div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>Rate Limiting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">Your Complete API Solution</h2>
            <p className="mt-4 max-w-3xl text-xl text-gray-600 mx-auto">
              ReqNest combines the power of API design, testing, and management in a single platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Design & Create</h3>
              <p className="mt-3 text-gray-600">
                Define your API schemas with our intuitive editor. Generate endpoints automatically with full validation.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CommandLineIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Test & Debug</h3>
              <p className="mt-3 text-gray-600">
                Test your APIs in real-time with our built-in console. Validate responses against your schema.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <CpuChipIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">Deploy & Monitor</h3>
              <p className="mt-3 text-gray-600">
                Deploy with one click. Monitor performance, track usage, and set up alerts for your APIs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Cloud Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase text-gray-500 tracking-wide mb-10">
            Trusted by innovative teams at
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
              <img src="/api/placeholder/120/60" alt="Company logo" className="h-8 object-contain opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
              <img src="/api/placeholder/120/60" alt="Company logo" className="h-8 object-contain opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
              <img src="/api/placeholder/120/60" alt="Company logo" className="h-8 object-contain opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="col-span-1 flex justify-center md:col-span-3 lg:col-span-1">
              <img src="/api/placeholder/120/60" alt="Company logo" className="h-8 object-contain opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="col-span-2 flex justify-center md:col-span-3 lg:col-span-1">
              <img src="/api/placeholder/120/60" alt="Company logo" className="h-8 object-contain opacity-70 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </section> */}

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">How ReqNest Works</h2>
            <p className="mt-4 max-w-3xl text-xl text-gray-600 mx-auto">
              Get from idea to production API in minutes, not days
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full text-2xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-lg font-semibold">Define Schema</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Create your API structure with our visual editor or import from OpenAPI
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full text-2xl font-bold text-green-600 mb-4">2</div>
              <h3 className="text-lg font-semibold">Get Endpoint</h3>
              <p className="mt-2 text-gray-600 text-sm">
                We instantly generate a unique endpoint with built-in validation
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full text-2xl font-bold text-purple-600 mb-4">3</div>
              <h3 className="text-lg font-semibold">Test in Sandbox</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Use our testing console to validate requests and responses
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full text-2xl font-bold text-yellow-600 mb-4">4</div>
              <h3 className="text-lg font-semibold">Deploy & Monitor</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Go live with one click and monitor performance in real-time
              </p>
            </div>
          </div>
          
          <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold">Ready to try it yourself?</h3>
            <p className="mt-2 text-gray-600">Create your first API endpoint in under 2 minutes</p>
            <Link
              to="/signup"
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-wide">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">Everything you need to manage your APIs</p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Powerful tools designed for developers and teams of all sizes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-lg">
                <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Secure Access</h3>
              <p className="mt-4 text-gray-600">
                Protect APIs with authentication, API keys, rate-limiting, and advanced security policies out of the box.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></div>
                  <span className="text-sm">OAuth 2.0 & JWT support</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></div>
                  <span className="text-sm">IP whitelisting</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></div>
                  <span className="text-sm">DDoS protection</span>
                </li>
              </ul>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-lg">
                <BoltIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Schema Validation</h3>
              <p className="mt-4 text-gray-600">
                Automatically validate requests against your API schema before they reach your backend.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></div>
                  <span className="text-sm">Request validation</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></div>
                  <span className="text-sm">Response transformation</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></div>
                  <span className="text-sm">Error handling</span>
                </li>
              </ul>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center p-3 bg-pink-100 rounded-lg">
                <ChartBarIcon className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Advanced Analytics</h3>
              <p className="mt-4 text-gray-600">
                Track API hits, errors, performance insights, and usage patterns to optimize your services.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-pink-600 rounded-full mr-2"></div>
                  <span className="text-sm">Real-time monitoring</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-pink-600 rounded-full mr-2"></div>
                  <span className="text-sm">Custom dashboards</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-pink-600 rounded-full mr-2"></div>
                  <span className="text-sm">Performance alerts</span>
                </li>
              </ul>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-lg">
                <ServerIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Rate Limiting</h3>
              <p className="mt-4 text-gray-600">
                Implement flexible rate limits based on user plans, API endpoints, or custom rules.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                  <span className="text-sm">Plan-based limits</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                  <span className="text-sm">Burst protection</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                  <span className="text-sm">Custom quotas</span>
                </li>
              </ul>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-lg">
                <CodeBracketIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Testing Sandbox</h3>
              <p className="mt-4 text-gray-600">
                Test your APIs in a secure sandbox environment with real-time debugging and validation.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                  <span className="text-sm">Interactive console</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                  <span className="text-sm">Request history</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                  <span className="text-sm">Mock responses</span>
                </li>
              </ul>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center p-3 bg-yellow-100 rounded-lg">
                <CloudIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Auto-Generated Docs</h3>
              <p className="mt-4 text-gray-600">
                Beautiful, interactive documentation automatically created from your API schemas.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2"></div>
                  <span className="text-sm">Interactive examples</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2"></div>
                  <span className="text-sm">Code snippets</span>
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2"></div>
                  <span className="text-sm">Custom domains</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <p className="text-5xl font-extrabold">99.9%</p>
              <p className="mt-2 text-lg font-medium">Uptime SLA</p>
              <p className="mt-1 text-indigo-200">Guaranteed reliability for your APIs</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold">2B+</p>
              <p className="mt-2 text-lg font-medium">API Calls Daily</p>
              <p className="mt-1 text-indigo-200">Processed across our global network</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold">200ms</p>
              <p className="mt-2 text-lg font-medium">Average Latency</p>
              <p className="mt-1 text-indigo-200">Global edge network performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">Loved by developers worldwide</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              See what developers are saying about ReqNest
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <img className="h-12 w-12 rounded-full" src="Sarah.png" alt="Sarah Johnson" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold">Sarah Johnson</h4>
                  <p className="text-gray-600">Lead Developer, TechCorp</p>
                </div>
              </div>
              <p className="text-gray-700">
                "ReqNest transformed how our team manages APIs. The schema validation alone saved us countless hours of debugging."
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <img className="h-12 w-12 rounded-full" src="michal.png" alt="Michael Chen" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold">Michael Chen</h4>
                  <p className="text-gray-600">CTO, StartupHub</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The automatic endpoint generation is a game-changer. We went from concept to production API in under an hour."
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <img className="h-12 w-12 rounded-full" src="Alex.png" alt="Alex Rodriguez" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold">Alex Rodriguez</h4>
                  <p className="text-gray-600">Software Engineer, FinTech Inc</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The testing sandbox is incredible. We can validate our APIs before deployment, which has drastically reduced our bug rate."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold">Ready to streamline your API workflow?</h2>
          <p className="mt-4 text-xl max-w-3xl mx-auto">
            Join thousands of developers and teams who use ReqNest to build, test, and scale their APIs.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-sm text-indigo-700 bg-yellow-400 hover:bg-yellow-300 transition-colors"
            >
              Create Free Account
              <ArrowRightIcon className="ml-3 h-5 w-5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center px-8 py-4 border border-white text-base font-medium rounded-xl shadow-sm text-white bg-white/10 hover:bg-white/20 transition-colors"
            >
              Schedule a Demo
            </Link>
          </div>
          <p className="mt-4 text-indigo-200">
            No credit card required. Start with our free plan today.
          </p>
        </div>
      </section>
    </div>
  );
}