import { useState, useEffect, useRef } from 'react';
import { 
  ArrowRightIcon,
  BoltIcon,
  CloudIcon,
  CodeBracketIcon,
  SparklesIcon,
  CpuChipIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  PlayCircleIcon,
  ChartBarIcon,
  CommandLineIcon,
  CircleStackIcon
} from '@heroicons/react/24/solid';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-gray-950 text-white min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
            alt="Digital Network Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950/95 via-green-950/40 to-black/95"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl animate-float-delayed"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Enhanced Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 border border-green-400/30 text-green-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <SparklesIcon className="w-4 h-4 mr-2 text-green-400" />
              Trusted by 50,000+ Developers Worldwide
            </div>

            {/* Main Heading */}
            <div className="space-y-6 mb-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="block text-white">Build APIs</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                  Instantly
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Define your data model and get production-ready REST & GraphQL APIs in seconds. 
              <span className="text-green-400 font-semibold"> Zero backend code. Enterprise ready.</span>
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <button className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-2xl shadow-green-500/25">
                Start Building Free
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group px-8 py-4 bg-transparent border border-green-400/30 hover:border-green-400/60 text-white font-semibold text-lg rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center justify-center hover:bg-green-400/10">
                <PlayCircleIcon className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {[
                { text: "Auto-Generated APIs", icon: CommandLineIcon },
                { text: "Real-time Support", icon: BoltIcon },
                { text: "Built-in Auth", icon: ShieldCheckIcon },
                { text: "Global CDN", icon: CloudIcon },
                { text: "Auto Scaling", icon: ChartBarIcon },
                { text: "TypeScript SDK", icon: CodeBracketIcon }
              ].map((feature, index) => (
                <div key={index} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 text-sm backdrop-blur-sm hover:bg-green-500/10 hover:border-green-400/30 transition-all duration-300 flex items-center group">
                  <feature.icon className="w-4 h-4 mr-2 text-green-400" />
                  {feature.text}
                </div>
              ))}
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
              {[
                { value: "50K+", label: "Active Developers", sublabel: "Global Community" },
                { value: "99.9%", label: "Uptime SLA", sublabel: "Enterprise Grade" },
                { value: "5B+", label: "Daily Requests", sublabel: "At Scale" }
              ].map((stat, index) => (
                <div key={index} className="group cursor-default">
                  <div className="text-2xl font-bold text-green-400 mb-1 group-hover:scale-110 transition-transform">{stat.value}</div>
                  <div className="text-sm font-semibold text-white">{stat.label}</div>
                  <div className="text-xs text-gray-400">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-green-400/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-green-400 rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section with Preview */}
      <section className="relative py-20 bg-gradient-to-b from-gray-950 to-black overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2134&auto=format&fit=crop" 
            alt="Code Background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Watch how teams at companies like Stripe and Vercel ship faster with our platform
            </p>
          </div>
          
          {/* Demo Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-green-400/20 bg-gray-900/50 backdrop-blur-sm">
            {/* Browser Frame */}
            <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 text-center text-sm text-gray-400">
                api-dashboard.example.com
              </div>
            </div>
            
            {/* Demo Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Code Preview */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <CircleStackIcon className="w-5 h-5" />
                  <span className="font-mono text-sm">schema.graphql</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                  <div className="text-green-400">type User {'{'}</div>
                  <div className="text-blue-400 ml-4">id: ID! @id</div>
                  <div className="text-blue-400 ml-4">email: String! @unique</div>
                  <div className="text-blue-400 ml-4">name: String</div>
                  <div className="text-green-400">{'}'}</div>
                  <div className="text-gray-500 mt-4"># Auto-generated APIs:</div>
                  <div className="text-gray-400"># REST: POST /users, GET /users, etc.</div>
                  <div className="text-gray-400"># GraphQL: Query.users, Mutation.createUser</div>
                </div>
              </div>
              
              {/* API Response Preview */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <CommandLineIcon className="w-5 h-5" />
                  <span className="font-mono text-sm">API Response</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                  <div className="text-purple-400">{'{'}</div>
                  <div className="text-yellow-400 ml-4">"data": {'{'}</div>
                  <div className="text-blue-400 ml-8">"users": [</div>
                  <div className="text-gray-300 ml-12">{'{'}</div>
                  <div className="text-green-400 ml-16">"id": "user_123",</div>
                  <div className="text-green-400 ml-16">"email": "team@example.com",</div>
                  <div className="text-green-400 ml-16">"name": "API Team"</div>
                  <div className="text-gray-300 ml-12">{'}'}</div>
                  <div className="text-blue-400 ml-8">]</div>
                  <div className="text-yellow-400 ml-4">{'}'}</div>
                  <div className="text-purple-400">{'}'}</div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-emerald-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 bg-gray-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop" 
            alt="Circuit Board Pattern"
            className="w-full h-full object-cover opacity-5"
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              From schema to production in minutes, not weeks
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: CodeBracketIcon,
                title: "Define Your Schema",
                description: "Create your data models with our intuitive interface or import existing schemas",
                step: "01"
              },
              {
                icon: BoltIcon,
                title: "Generate APIs Instantly", 
                description: "Get REST & GraphQL endpoints with full CRUD operations and real-time capabilities",
                step: "02"
              },
              {
                icon: CloudIcon,
                title: "Deploy Globally",
                description: "Go live with automatic global deployment, scaling, and enterprise security",
                step: "03"
              }
            ].map((item, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gray-800 rounded-2xl p-8 border border-green-400/20 hover:border-green-400/40 transition-all duration-300 h-full">
                  <div className="text-green-400 text-sm font-mono mb-2">Step {item.step}</div>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-400/10 rounded-2xl flex items-center justify-center mb-6 border border-green-400/20">
                    <item.icon className="h-8 w-8 text-green-400" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-20 bg-black overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2032&auto=format&fit=crop" 
            alt="Server Network"
            className="w-full h-full object-cover opacity-8"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black/90"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need for production applications
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheckIcon,
                title: "Built-in Security",
                description: "Authentication, authorization, rate limiting, and DDoS protection"
              },
              {
                icon: CpuChipIcon,
                title: "Auto Validation", 
                description: "Schema-based request validation and type safety"
              },
              {
                icon: ServerStackIcon,
                title: "Real-time Subscriptions",
                description: "WebSocket support and GraphQL subscriptions"
              },
              {
                icon: CloudIcon,
                title: "Global Edge Network",
                description: "Deploy to 100+ locations worldwide with edge computing"
              },
              {
                icon: BoltIcon,
                title: "Auto Scaling",
                description: "Handles traffic spikes from 0 to millions of requests"
              },
              {
                icon: CodeBracketIcon,
                title: "TypeScript SDK",
                description: "Fully typed client libraries and auto-completion"
              },
              {
                icon: CircleStackIcon,
                title: "Database Agnostic",
                description: "Works with PostgreSQL, MySQL, MongoDB, and more"
              },
              {
                icon: ChartBarIcon,
                title: "Analytics & Metrics",
                description: "Real-time monitoring and performance insights"
              },
              {
                icon: CommandLineIcon,
                title: "CLI & CI/CD",
                description: "Command line tools and GitHub Actions integration"
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-green-400/30 transition-all duration-300 backdrop-blur-sm hover:bg-gray-800/30">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-green-400/20 group-hover:border-green-400/40">
                    <feature.icon className="h-6 w-6 text-green-400" />
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

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-green-950/30 to-black">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Ship Faster?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers building better APIs in record time. Start free with no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-green-500/25">
              Get Started Free
            </button>
            <button className="px-8 py-4 bg-transparent border border-green-400/30 hover:border-green-400/60 text-white font-semibold text-lg rounded-xl transition-all duration-300 backdrop-blur-sm hover:bg-green-400/10">
              Schedule a Demo
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            No credit card required • Free forever tier • Setup in 2 minutes
          </p>
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