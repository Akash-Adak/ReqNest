import { useState, useEffect } from 'react';
import { 
  ArrowRightIcon,
  BoltIcon,
  CloudIcon,
  CodeBracketIcon,
  SparklesIcon,
  CpuChipIcon,
  ServerStackIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen pt-16">
      {/* Hero Section - Minimalist Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
          </div>
          
          {/* Floating API Elements */}
          <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full opacity-40 animate-bounce"></div>
          <div className="absolute bottom-40 left-20 w-4 h-4 bg-pink-400 rounded-full opacity-50 animate-ping"></div>
          
          {/* Animated Orbs */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-float-slow"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Minimal Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <SparklesIcon className="w-4 h-4 mr-2 text-purple-400" />
              The Future of Backend Development
            </div>

            {/* Main Heading - Clean & Bold */}
            <div className="space-y-6 mb-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="block text-white">Build APIs</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  Without Code
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Define your data model. Get production-ready REST & GraphQL APIs instantly. 
              <span className="text-white font-semibold"> Zero backend code required.</span>
            </p>
            
            {/* CTA Buttons - Clean Design */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <button className="group px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 font-semibold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-2xl">
                Start Building Free
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="px-8 py-4 bg-transparent border border-white/20 hover:border-white/40 text-white font-semibold text-lg rounded-lg transition-all duration-300 backdrop-blur-sm">
                View Live Demo
              </button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                "Auto-Generated APIs",
                "Real-time Support", 
                "Built-in Auth",
                "Global CDN",
                "Auto Scaling",
                "TypeScript SDK"
              ].map((feature, index) => (
                <div key={index} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 text-sm backdrop-blur-sm hover:bg-white/10 transition-colors">
                  {feature}
                </div>
              ))}
            </div>

            {/* Stats - Minimal */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
              {[
                { value: "50K+", label: "Developers" },
                { value: "99.9%", label: "Uptime" },
                { value: "5B+", label: "Requests/Day" }
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Clean Cards */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              From schema to production in minutes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: CodeBracketIcon,
                title: "Define Schema",
                description: "Create your data models with our intuitive interface or import existing schemas"
              },
              {
                icon: BoltIcon,
                title: "Generate APIs", 
                description: "Instantly get REST & GraphQL endpoints with full CRUD operations"
              },
              {
                icon: CloudIcon,
                title: "Deploy",
                description: "Go live with global deployment, auto-scaling, and enterprise security"
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full backdrop-blur-sm">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Clean Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-400">
              Production-ready features out of the box
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheckIcon,
                title: "Built-in Security",
                description: "Authentication, authorization, and rate limiting"
              },
              {
                icon: CpuChipIcon,
                title: "Auto Validation", 
                description: "Schema-based request validation"
              },
              {
                icon: ServerStackIcon,
                title: "Real-time",
                description: "WebSocket support and subscriptions"
              },
              {
                icon: CloudIcon,
                title: "Global Edge",
                description: "Deploy to 100+ locations worldwide"
              },
              {
                icon: BoltIcon,
                title: "Auto Scaling",
                description: "Handles traffic spikes automatically"
              },
              {
                icon: CodeBracketIcon,
                title: "TypeScript SDK",
                description: "Fully typed client libraries"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.03); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}