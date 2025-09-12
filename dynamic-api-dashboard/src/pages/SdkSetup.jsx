// src/pages/SdkSetup.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FiCopy, FiCheck, FiArrowLeft, FiDownload, FiChevronDown, FiChevronUp, FiCode, FiPackage, FiPlay, FiDatabase, FiZap } from "react-icons/fi";

export default function SdkSetup() {
 const baseUrl = import.meta.env.VITE_API_URL;
  const { apiName } = useParams();
  const [api, setApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [expandedSections, setExpandedSections] = useState({
    install: true,
    initialize: true,
    usage: true,
    schema: false
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`${baseUrl}/apis/${apiName}`, { withCredentials: true })
      .then((res) => setApi(res.data))
      .catch((err) => {
        console.error("Error fetching API:", err);
        setError("Failed to fetch API details. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [apiName]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4">
      {/* Mouse follower */}
      <div 
        className="fixed w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none z-50 opacity-20 transition-all duration-100 ease-out blur-sm"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
      />
      
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(120,_119,_198,_0.1),_transparent_50%)] bg-[radial-gradient(circle_at_80%_20%,_rgba(255,_105,_180,_0.1),_transparent_50%)]"></div>
      
      <div className="relative max-w-6xl mx-auto">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-4 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl w-24 mb-6"></div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl"></div>
              <div className="space-y-3">
                <div className="h-8 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl w-80"></div>
                <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl w-96"></div>
              </div>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-8 shadow-2xl">
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-gray-700/50 rounded-2xl overflow-hidden">
                  <div className="h-20 bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-2xl flex items-center px-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl mr-4"></div>
                    <div className="space-y-2">
                      <div className="h-5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded w-32"></div>
                      <div className="h-3 bg-gray-600 rounded w-48"></div>
                    </div>
                  </div>
                  <div className="h-40 bg-gradient-to-br from-gray-900/50 to-gray-800/50"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4">
      {/* Mouse follower */}
      <div 
        className="fixed w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none z-50 opacity-20 transition-all duration-100 ease-out blur-sm"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
      />
      
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(120,_119,_198,_0.1),_transparent_50%)] bg-[radial-gradient(circle_at_80%_20%,_rgba(255,_105,_180,_0.1),_transparent_50%)]"></div>
      
      <div className="relative max-w-6xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-8 shadow-2xl">
          <div className="bg-gradient-to-r from-red-900/50 to-pink-900/50 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FiCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Error Loading SDK</h3>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          </div>
          <Link 
            to="/apis" 
            className="group inline-flex items-center mt-8 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:-translate-y-1 font-semibold"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to APIs
          </Link>
        </div>
      </div>
    </div>
  );

  if (!api) return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4">
      {/* Mouse follower */}
      <div 
        className="fixed w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none z-50 opacity-20 transition-all duration-100 ease-out blur-sm"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
      />
      
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(120,_119,_198,_0.1),_transparent_50%)] bg-[radial-gradient(circle_at_80%_20%,_rgba(255,_105,_180,_0.1),_transparent_50%)]"></div>
      
      <div className="relative max-w-6xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-8 shadow-2xl">
          <div className="bg-gradient-to-r from-yellow-900/50 to-amber-900/50 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FiPackage className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">API Not Found</h3>
                <p className="text-yellow-200">The requested API could not be located.</p>
              </div>
            </div>
          </div>
          <Link 
            to="/apis" 
            className="group inline-flex items-center mt-8 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:-translate-y-1 font-semibold"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to APIs
          </Link>
        </div>
      </div>
    </div>
  );

  const schema = typeof api.schemaJson === "string" 
    ? JSON.parse(api.schemaJson) 
    : api.schemaJson;

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4 pb-12">
      {/* Mouse follower */}
      <div 
        className="fixed w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none z-50 opacity-20 transition-all duration-100 ease-out blur-sm"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
      />
      
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(120,_119,_198,_0.1),_transparent_50%)] bg-[radial-gradient(circle_at_80%_20%,_rgba(255,_105,_180,_0.1),_transparent_50%)]"></div>
      
      <div className="relative max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/apis" 
            className="group inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-all duration-300"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to APIs
          </Link>
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-75 animate-pulse"></div>
                <div className="relative w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-12 transition-all duration-300">
                  <FiZap className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200">
                  SDK Setup for {api.name}
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                  {api.description || "No description available."}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-200 text-sm font-bold rounded-2xl backdrop-blur-sm">
                JavaScript SDK
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-200 text-sm font-bold rounded-2xl backdrop-blur-sm">
                Ready to Use
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-purple-500/20 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl"></div>
          
          <div className="relative p-8">
            <div className="space-y-6">
              <Section 
                title="Installation" 
                icon={FiPackage}
                color="emerald"
                description="Install the ReqNest SDK package"
                expanded={expandedSections.install}
                onToggle={() => toggleSection("install")}
              >
                <CodeBlock 
                  code="npm install reqnest-sdk" 
                  language="bash" 
                />
              </Section>

              <Section 
                title="Initialization" 
                icon={FiCode}
                color="blue"
                description="Set up and configure your SDK instance"
                expanded={expandedSections.initialize}
                onToggle={() => toggleSection("initialize")}
              >
                <CodeBlock
                  code={`import ReqNestSDK from "reqnest-sdk";

const sdk = new ReqNestSDK({
  baseUrl: "${baseUrl}"
});

sdk.setApiKey("YOUR_API_KEY_HERE");

const ${api.name}Api = sdk.schema("${api.name}");`}
                  language="javascript"
                />
              </Section>

              <Section 
                title="Usage Examples" 
                icon={FiPlay}
                color="purple"
                description="Learn how to perform common operations"
                expanded={expandedSections.usage}
                onToggle={() => toggleSection("usage")}
              >
                <CodeBlock
                  code={`// Create a record
await ${api.name}Api.create({ field1: "value", field2: "value" });

// List records
const records = await ${api.name}Api.list();

// Search records
const found = await ${api.name}Api.search({ field1: "value" });

// Update a record
await ${api.name}Api.update({ _id: records[0]._id, field1: "newValue" }, false, "_id");

// Delete a record
await ${api.name}Api.delete({ _id: records[0]._id });`}
                  language="javascript"
                />
              </Section>

              <Section 
                title="Schema" 
                icon={FiDatabase}
                color="orange"
                description="View the complete API schema definition"
                expanded={expandedSections.schema}
                onToggle={() => toggleSection("schema")}
              >
                <CodeBlock 
                  code={JSON.stringify(schema, null, 2)} 
                  language="json" 
                />
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, color, description, children, expanded, onToggle }) {
  const colorVariants = {
    emerald: {
      bg: 'from-emerald-500/10 to-green-500/10',
      border: 'border-emerald-500/30',
      icon: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white',
      text: 'text-emerald-200',
      glow: 'shadow-emerald-500/25'
    },
    blue: {
      bg: 'from-blue-500/10 to-indigo-500/10',
      border: 'border-blue-500/30',
      icon: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
      text: 'text-blue-200',
      glow: 'shadow-blue-500/25'
    },
    purple: {
      bg: 'from-purple-500/10 to-violet-500/10',
      border: 'border-purple-500/30',
      icon: 'bg-gradient-to-r from-purple-500 to-violet-500 text-white',
      text: 'text-purple-200',
      glow: 'shadow-purple-500/25'
    },
    orange: {
      bg: 'from-orange-500/10 to-amber-500/10',
      border: 'border-orange-500/30',
      icon: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white',
      text: 'text-orange-200',
      glow: 'shadow-orange-500/25'
    }
  };

  const colors = colorVariants[color];

  return (
    <div className={`border ${colors.border} rounded-2xl overflow-hidden shadow-2xl ${colors.glow} hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}>
      <button 
        className={`w-full flex items-center justify-between p-6 bg-gradient-to-r ${colors.bg} hover:from-white/10 hover:to-gray-800/50 transition-all duration-300 group backdrop-blur-sm border-b ${colors.border}`}
        onClick={onToggle}
      >
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 ${colors.icon} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h2 className={`text-xl font-bold text-white`}>{title}</h2>
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          </div>
        </div>
        <div className={`w-10 h-10 ${colors.icon} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 ${expanded ? 'rotate-180' : ''}`}>
          <FiChevronDown className="w-5 h-5" />
        </div>
      </button>
      {expanded && (
        <div className="bg-gray-900/50 backdrop-blur-sm">
          {children}
        </div>
      )}
    </div>
  );
}

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageColor = (lang) => {
    switch(lang) {
      case 'javascript': return 'bg-yellow-500';
      case 'bash': return 'bg-green-500';
      case 'json': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="relative group">
      {/* Language indicator and copy button header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 ${getLanguageColor(language)} rounded-full shadow-lg`}></div>
          <span className="text-sm font-bold text-gray-300 capitalize">{language}</span>
          <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
          <span className="text-xs text-gray-500">Ready to copy</span>
        </div>
        <button
          onClick={handleCopy}
          className="group/btn flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500 hover:to-pink-500 border border-purple-500/30 hover:border-purple-500 text-purple-200 hover:text-white rounded-xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-1"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <FiCheck className="w-4 h-4" />
              <span className="text-sm font-medium">Copied!</span>
            </>
          ) : (
            <>
              <FiCopy className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">Copy Code</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code content */}
      <div className="bg-gray-950/80 backdrop-blur-sm m-6 mb-6 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
        <pre className="text-gray-100 p-6 overflow-x-auto text-sm leading-relaxed font-mono">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
}