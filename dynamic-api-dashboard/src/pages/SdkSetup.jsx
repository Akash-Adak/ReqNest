// src/pages/SdkSetup.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { 
  DocumentArrowDownIcon,
  ArrowLeftIcon,
  CodeBracketIcon,
  CubeIcon,
  PlayIcon,
  TableCellsIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BoltIcon
} from "@heroicons/react/24/outline";

export default function SdkSetup() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const { apiName } = useParams();
  const [api, setApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    install: true,
    initialize: true,
    usage: true,
    endpoints: true,
    schema: false
  });

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
      <div className="relative max-w-6xl mx-auto">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-4 bg-gray-700 rounded w-24 mb-6"></div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gray-700 rounded-2xl"></div>
              <div className="space-y-3">
                <div className="h-8 bg-gray-700 rounded w-80"></div>
                <div className="h-4 bg-gray-700 rounded w-96"></div>
              </div>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-gray-700 rounded-xl overflow-hidden">
                  <div className="h-20 bg-gray-800 rounded-t-xl flex items-center px-6">
                    <div className="w-10 h-10 bg-gray-700 rounded-xl mr-4"></div>
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-700 rounded w-32"></div>
                      <div className="h-3 bg-gray-600 rounded w-48"></div>
                    </div>
                  </div>
                  <div className="h-40 bg-gray-900/50"></div>
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
      <div className="relative max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
                <CodeBracketIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Error Loading SDK</h3>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          </div>
          <Link 
            to="/apis" 
            className="inline-flex items-center mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 font-semibold"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to APIs
          </Link>
        </div>
      </div>
    </div>
  );

  if (!api) return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4">
      <div className="relative max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center">
                <CubeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">API Not Found</h3>
                <p className="text-yellow-200">The requested API could not be located.</p>
              </div>
            </div>
          </div>
          <Link 
            to="/apis" 
            className="inline-flex items-center mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 font-semibold"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to APIs
          </Link>
        </div>
      </div>
    </div>
  );

  const schema = typeof api.schemaJson === "string" 
    ? JSON.parse(api.schemaJson) 
    : api.schemaJson;

  // Generate realistic endpoints from schema
  const endpoints = schema?.paths ? Object.entries(schema.paths).map(([path, methods]) => ({
    path,
    methods: Object.keys(methods)
  })) : [];

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4 pb-12">
      <div className="relative max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/apis" 
            className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to APIs
          </Link>
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BoltIcon className="w-8 h-8 text-white" />
              </div>
              
              <div className="space-y-3">
                <h1 className="text-4xl font-bold text-white">
                  SDK Setup for <span className="text-indigo-400">{api.name}</span>
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                  {api.description || "Complete SDK integration guide with examples and documentation."}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 text-sm font-bold rounded-xl">
                JavaScript SDK
              </div>
              <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-200 text-sm font-bold rounded-xl">
                Ready to Use
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="text-2xl font-bold text-white">{endpoints.length}</div>
            <div className="text-gray-400 text-sm">Endpoints</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="text-2xl font-bold text-white">v1.0</div>
            <div className="text-gray-400 text-sm">SDK Version</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="text-2xl font-bold text-white">REST</div>
            <div className="text-gray-400 text-sm">API Type</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="text-2xl font-bold text-white">JSON</div>
            <div className="text-gray-400 text-sm">Data Format</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-8">
            <div className="space-y-6">
              <Section 
                title="Installation" 
                icon={CubeIcon}
                color="emerald"
                description="Install the ReqNest SDK package via npm"
                expanded={expandedSections.install}
                onToggle={() => toggleSection("install")}
              >
                <CodeBlock 
                  code="npm install @reqnest/sdk" 
                  language="bash"
                  note="Make sure you have Node.js 16+ installed"
                />
                <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <h4 className="font-semibold text-white mb-2">Alternative Installation Methods</h4>
                  <div className="space-y-2 text-sm">
                    <CodeBlock code="yarn add @reqnest/sdk" language="bash" small />
                    <CodeBlock code="pnpm add @reqnest/sdk" language="bash" small />
                  </div>
                </div>
              </Section>

              <Section 
                title="Initialization & Configuration" 
                icon={CodeBracketIcon}
                color="blue"
                description="Set up and configure your SDK instance with authentication"
                expanded={expandedSections.initialize}
                onToggle={() => toggleSection("initialize")}
              >
                <CodeBlock
                  code={`import { ReqNestClient } from '@reqnest/sdk';

// Initialize the client
const client = new ReqNestClient({
  baseURL: '${baseUrl}',
  apiKey: 'your-api-key-here', // Get from dashboard
  timeout: 10000,
});

// Get your API instance
const ${api.name}API = client.api('${api.name}');`}
                  language="javascript"
                  note="Replace 'your-api-key-here' with your actual API key from the dashboard"
                />
              </Section>

              <Section 
                title="Core Operations" 
                icon={PlayIcon}
                color="purple"
                description="Perform CRUD operations with practical examples"
                expanded={expandedSections.usage}
                onToggle={() => toggleSection("usage")}
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Create Record</h4>
                    <CodeBlock
                      code={`// Create a new record
const newRecord = await ${api.name}API.create({
  name: "Example Record",
  description: "This is a sample record",
  status: "active",
  metadata: {
    category: "sample",
    priority: "high"
  }
});

console.log("Created record:", newRecord);`}
                      language="javascript"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">Read Operations</h4>
                    <CodeBlock
                      code={`// Get all records
const allRecords = await ${api.name}API.list();

// Get record by ID
const record = await ${api.name}API.get('record-id-here');

// Search records
const searchResults = await ${api.name}API.search({
  status: "active",
  "metadata.category": "sample"
});`}
                      language="javascript"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">Update & Delete</h4>
                    <CodeBlock
                      code={`// Update a record
const updatedRecord = await ${api.name}API.update('record-id-here', {
  status: "completed",
  description: "Updated description"
});

// Delete a record
await ${api.name}API.delete('record-id-here');`}
                      language="javascript"
                    />
                  </div>
                </div>
              </Section>

              <Section 
                title="Available Endpoints" 
                icon={TableCellsIcon}
                color="orange"
                description="Complete list of available API endpoints"
                expanded={expandedSections.endpoints}
                onToggle={() => toggleSection("endpoints")}
              >
                <div className="space-y-3">
                  {endpoints.slice(0, 10).map((endpoint, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex space-x-1">
                          {endpoint.methods.map((method, idx) => (
                            <span 
                              key={idx}
                              className={`px-2 py-1 text-xs font-bold rounded ${
                                method === 'get' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                method === 'post' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                method === 'put' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                method === 'delete' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                              }`}
                            >
                              {method.toUpperCase()}
                            </span>
                          ))}
                        </div>
                        <code className="text-gray-200 font-mono text-sm">{endpoint.path}</code>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {endpoint.methods.length} method{endpoint.methods.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                  {endpoints.length > 10 && (
                    <div className="text-center text-gray-400 text-sm py-2">
                      + {endpoints.length - 10} more endpoints available
                    </div>
                  )}
                </div>
              </Section>

              <Section 
                title="API Schema" 
                icon={DocumentArrowDownIcon}
                color="red"
                description="Complete OpenAPI schema definition"
                expanded={expandedSections.schema}
                onToggle={() => toggleSection("schema")}
              >
                <CodeBlock 
                  code={JSON.stringify(schema, null, 2)} 
                  language="json"
                  note="Full OpenAPI 3.0 specification for this API"
                />
              </Section>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
            <h3 className="font-bold text-white mb-4">Need Help?</h3>
            <ul className="space-y-3 text-gray-400">
              <li>• Check our <a href="#" className="text-indigo-400 hover:text-indigo-300">documentation</a></li>
              <li>• Join our <a href="#" className="text-indigo-400 hover:text-indigo-300">Discord community</a></li>
              <li>• View <a href="#" className="text-indigo-400 hover:text-indigo-300">API examples</a></li>
              <li>• Contact <a href="#" className="text-indigo-400 hover:text-indigo-300">support</a></li>
            </ul>
          </div>
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
            <h3 className="font-bold text-white mb-4">Next Steps</h3>
            <ul className="space-y-3 text-gray-400">
              <li>• Test your API in the <Link to={`/test/${api.name}`} className="text-indigo-400 hover:text-indigo-300">Playground</Link></li>
              <li>• Monitor usage in your <a href="#" className="text-indigo-400 hover:text-indigo-300">dashboard</a></li>
              <li>• Set up <a href="#" className="text-indigo-400 hover:text-indigo-300">webhooks</a></li>
              <li>• Explore <a href="#" className="text-indigo-400 hover:text-indigo-300">advanced features</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, color, description, children, expanded, onToggle }) {
  const colorVariants = {
    emerald: {
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      icon: 'bg-emerald-500 text-white',
      text: 'text-emerald-400'
    },
    blue: {
      bg: 'bg-blue-500/10 border-blue-500/20',
      icon: 'bg-blue-500 text-white',
      text: 'text-blue-400'
    },
    purple: {
      bg: 'bg-purple-500/10 border-purple-500/20',
      icon: 'bg-purple-500 text-white',
      text: 'text-purple-400'
    },
    orange: {
      bg: 'bg-orange-500/10 border-orange-500/20',
      icon: 'bg-orange-500 text-white',
      text: 'text-orange-400'
    },
    red: {
      bg: 'bg-red-500/10 border-red-500/20',
      icon: 'bg-red-500 text-white',
      text: 'text-red-400'
    }
  };

  const colors = colorVariants[color];

  return (
    <div className={`border rounded-xl overflow-hidden ${colors.bg} ${colors.bg.includes('border') ? colors.bg.split(' ')[1] : 'border-gray-600'}`}>
      <button 
        className={`w-full flex items-center justify-between p-6 hover:bg-gray-700/50 transition-all duration-300`}
        onClick={onToggle}
      >
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h2 className={`text-xl font-bold text-white`}>{title}</h2>
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          </div>
        </div>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.text} bg-gray-700`}>
          {expanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </div>
      </button>
      {expanded && (
        <div className="border-t border-gray-700/50">
          <div className="p-6">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

function CodeBlock({ code, language, note, small = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-gray-400 uppercase">{language}</span>
          {note && (
            <>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <span className="text-xs text-gray-500">{note}</span>
            </>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm"
          aria-label="Copy code"
        >
          {copied ? (
            <ClipboardDocumentCheckIcon className="w-4 h-4 text-green-400" />
          ) : (
            <ClipboardDocumentIcon className="w-4 h-4" />
          )}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      
      {/* Code content */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
        <pre className={`text-gray-100 p-4 overflow-x-auto ${small ? 'text-sm' : 'text-sm leading-relaxed'} font-mono`}>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}