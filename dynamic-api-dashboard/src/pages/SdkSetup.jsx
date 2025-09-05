// src/pages/SdkSetup.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FiCopy, FiCheck, FiArrowLeft, FiDownload, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function SdkSetup() {
  const { apiName } = useParams();
  const [api, setApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    install: true,
    initialize: true,
    usage: true,
    schema: false
  });

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:8080/apis/${apiName}`, { withCredentials: true })
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
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse bg-white rounded-lg shadow p-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
            {error}
          </div>
          <Link 
            to="/apis" 
            className="inline-flex items-center mt-6 text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" />
            Back to APIs
          </Link>
        </div>
      </div>
    </div>
  );

  if (!api) return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-yellow-700 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            API not found.
          </div>
          <Link 
            to="/apis" 
            className="inline-flex items-center mt-6 text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" />
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
    <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            to="/apis" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to APIs
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                SDK Setup for {api.name}
              </h1>
              <p className="text-gray-600 mt-2">
                {api.description || "No description available."}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                JavaScript SDK
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <Section 
              title="Installation" 
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
              expanded={expandedSections.initialize}
              onToggle={() => toggleSection("initialize")}
            >
              <CodeBlock
                code={`import ReqNestSDK from "reqnest-sdk";

const sdk = new ReqNestSDK({
  baseUrl: "http://localhost:8080"
});

sdk.setApiKey("YOUR_API_KEY_HERE");

const ${api.name}Api = sdk.schema("${api.name}");`}
                language="javascript"
              />
            </Section>

            <Section 
              title="Usage Examples" 
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
  );
}

function Section({ title, children, expanded, onToggle }) {
  return (
    <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
      <button 
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100"
        onClick={onToggle}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        {expanded ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {expanded && (
        <div className="p-0">
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

  return (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-200 p-4 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 bg-gray-700 text-white p-2 rounded hover:bg-gray-600"
        aria-label="Copy code"
      >
        {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
      </button>
    </div>
  );
}