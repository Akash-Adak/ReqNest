import { useState, useEffect } from 'react';
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
  CommandLineIcon,
  CheckIcon,
  PlayIcon,
  StarIcon
} from '@heroicons/react/24/solid';

export default function Homepage() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-gray-900 text-white overflow-x-hidden">
      {/* Mouse follower */}
      <div 
        className="fixed w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none z-50 opacity-20 transition-all duration-100 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${Math.sin(Date.now() * 0.005) * 0.3 + 1})`
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-10"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm mb-8 animate-bounce">
              <StarIcon className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm font-medium">Trusted by 50,000+ developers</span>
            </div>

            {/* Main heading with gradient text */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              <span className="block bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                API Management
              </span>
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mt-2 animate-pulse">
                Reimagined
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-gray-300 mb-10">
              Build, test, and scale your APIs with the most intuitive platform on the planet. 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
                {' '}Schema validation, automated testing, and real-time monitoring{' '}
              </span>
              in one beautiful interface.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  Start Building Now
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              
              <button className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 font-bold text-lg rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center">
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Watch Demo
                </div>
              </button>
            </div>
            
            {/* Stats Bar */}
            <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: "99.9% Uptime", value: "SLA" },
                  { label: "Schema Validation", value: "Built-in" },
                  { label: "Real-time Testing", value: "Instant" },
                  { label: "Rate Limiting", value: "Advanced" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-ping"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2 absolute"></div>
                    </div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-32 bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Your Complete 
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> API Universe</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              ReqNest combines the power of API design, testing, and management in a single, beautiful platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: DocumentTextIcon,
                title: "Design & Create",
                description: "Define your API schemas with our intuitive editor. Generate endpoints automatically with full validation.",
                color: "from-blue-500 to-cyan-500",
                delay: "0s"
              },
              {
                icon: CommandLineIcon,
                title: "Test & Debug",
                description: "Test your APIs in real-time with our built-in console. Validate responses against your schema.",
                color: "from-green-500 to-emerald-500",
                delay: "0.2s"
              },
              {
                icon: CpuChipIcon,
                title: "Deploy & Monitor",
                description: "Deploy with one click. Monitor performance, track usage, and set up alerts for your APIs.",
                color: "from-purple-500 to-pink-500",
                delay: "0.4s"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="group relative p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-gray-700/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
                style={{ animationDelay: item.delay }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl mb-6 shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {item.description}
                </p>
                
                {/* Hover effect overlay */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-10"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-4">
              🚀 Features
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Everything you need to 
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> dominate APIs</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Powerful tools designed for developers and teams who refuse to settle for ordinary
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheckIcon,
                title: "Fort Knox Security",
                description: "Protect APIs with enterprise-grade authentication, API keys, rate-limiting, and advanced security policies.",
                features: ["OAuth 2.0 & JWT support", "IP whitelisting", "DDoS protection"],
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: BoltIcon,
                title: "Lightning Validation",
                description: "Automatically validate requests against your API schema before they touch your backend.",
                features: ["Request validation", "Response transformation", "Error handling"],
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: ChartBarIcon,
                title: "Insightful Analytics",
                description: "Track API hits, errors, performance insights, and usage patterns with surgical precision.",
                features: ["Real-time monitoring", "Custom dashboards", "Performance alerts"],
                color: "from-pink-500 to-red-500"
              },
              {
                icon: ServerIcon,
                title: "Smart Rate Limiting",
                description: "Implement flexible rate limits based on user plans, API endpoints, or custom rules that actually work.",
                features: ["Plan-based limits", "Burst protection", "Custom quotas"],
                color: "from-blue-500 to-indigo-500"
              },
              {
                icon: CodeBracketIcon,
                title: "Testing Playground",
                description: "Test your APIs in a secure sandbox environment with real-time debugging and validation tools.",
                features: ["Interactive console", "Request history", "Mock responses"],
                color: "from-green-500 to-teal-500"
              },
              {
                icon: CloudIcon,
                title: "Auto-Magic Docs",
                description: "Beautiful, interactive documentation automatically generated from your API schemas. Zero effort, maximum impact.",
                features: ["Interactive examples", "Code snippets", "Custom domains"],
                color: "from-yellow-500 to-orange-500"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative p-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-3xl border border-gray-700/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className={`inline-flex items-center justify-center p-4 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-3">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3 group-hover:animate-pulse"></div>
                      {item}
                    </li>
                  ))}
                </ul>
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-400 rounded-full opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">The Numbers Don't Lie</h2>
            <p className="text-xl text-purple-100">Trusted by developers who demand excellence</p>
          </div>
          
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              { value: "99.9%", label: "Uptime SLA", desc: "Guaranteed reliability for your APIs", icon: "🚀" },
              { value: "5B+", label: "API Calls Daily", desc: "Processed across our global network", icon: "⚡" },
              { value: "50ms", label: "Average Latency", desc: "Global edge network performance", icon: "🌍" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-6xl mb-2">{stat.icon}</div>
                <p className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </p>
                <p className="text-2xl font-bold text-white mb-2">{stat.label}</p>
                <p className="text-purple-200">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Developers 
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"> love us</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See what the brightest minds in tech are saying about ReqNest
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Lead Developer, TechCorp",
                content: "ReqNest transformed how our team manages APIs. The schema validation alone saved us countless hours of debugging. It's like having a superpower.",
                rating: 5,
                avatar: "SJ"
              },
              {
                name: "Michael Chen",
                role: "CTO, StartupHub", 
                content: "The automatic endpoint generation is a game-changer. We went from concept to production API in under an hour. Our investors were blown away.",
                rating: 5,
                avatar: "MC"
              },
              {
                name: "Alex Rodriguez",
                role: "Software Engineer, FinTech Inc",
                content: "The testing sandbox is incredible. We can validate our APIs before deployment, which has drastically reduced our bug rate to near zero.",
                rating: 5,
                avatar: "AR"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="group relative p-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-3xl border border-gray-700/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Rating stars */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Ready to build the 
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> future</span>?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Join over 50,000 developers and teams who use ReqNest to build, test, and scale world-class APIs. 
            Your next breakthrough is just one click away.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
            <button className="group relative px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-black text-xl rounded-2xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:-translate-y-3 hover:scale-110">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center">
                🚀 Start Building for Free
                <ArrowRightIcon className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
            
            <button className="group px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-bold text-xl rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
              💬 Talk to Sales
            </button>
          </div>
          
          <p className="text-purple-200 text-lg">
            ✨ No credit card required • 🎯 Setup in 30 seconds • 🔒 Enterprise-grade security
          </p>
        </div>
      </section>

      <style >{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </div>
  );
}