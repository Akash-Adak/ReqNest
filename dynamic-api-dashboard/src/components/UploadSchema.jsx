import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Ajv from "ajv";
import { 
  ArrowUpTrayIcon, 
  LightBulbIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  DocumentDuplicateIcon,
  SparklesIcon,
  PencilSquareIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  CodeBracketIcon,
  CpuChipIcon,
  RocketLaunchIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

const ajv = new Ajv();

export default function UploadSchema() {
const baseUrl = window._env_?.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [schema, setSchema] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [exampleVisible, setExampleVisible] = useState(false);
  const [isValidJson, setIsValidJson] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [existingApi, setExistingApi] = useState(null);
  const [formMode, setFormMode] = useState(false);
  const [fields, setFields] = useState([]);
  const [requiredFields, setRequiredFields] = useState([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");

  useEffect(() => {
    if (location.state?.existingApi) {
      setExistingApi(location.state.existingApi);
      getSchemaDetails(location.state.existingApi);
    }
  }, [location.state]);

  useEffect(() => {
    if (!schema) {
      setIsValidJson(true);
      return;
    }
    try {
      JSON.parse(schema);
      setIsValidJson(true);
    } catch (err) {
      setIsValidJson(false);
    }
  }, [schema]);

  const getSchemaDetails = async (apiData) => {
    try {
      console.log("Loading existing API:", apiData);
      const response = await axios.get(
        `${baseUrl}/apis/${apiData.name}`,
        { withCredentials: true }
      );
      
      setName(response.data.name);
      let formattedSchema = response.data.schemaJson;
      
      if (typeof formattedSchema === 'string') {
        try {
          const parsedSchema = JSON.parse(formattedSchema);
          formattedSchema = JSON.stringify(parsedSchema, null, 2);
        } catch (e) {
          formattedSchema = formattedSchema.replace(/\\n/g, '\n');
          formattedSchema = formattedSchema.replace(/\\t/g, '\t');
          formattedSchema = formattedSchema.replace(/\\"/g, '"');
        }
      }
      
      setSchema(formattedSchema);
      setIsUpdateMode(true);
      setMessage({ text: `Loaded schema "${response.data.name}" for editing.`, type: "info" });
      
    } catch (err) {
      console.error("Error loading schema:", err);
      setMessage({
        text: "Error loading schema: " + (err.response?.data?.message || err.message),
        type: "error"
      });
    }
  };

  const addField = () => {
    setFields([...fields, { name: "", type: "string", description: "", enum: [] }]);
  };

  const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const toggleRequired = (fieldName) => {
    if (requiredFields.includes(fieldName)) {
      setRequiredFields(requiredFields.filter((f) => f !== fieldName));
    } else {
      setRequiredFields([...requiredFields, fieldName]);
    }
  };

  const generateSchemaWithAI = async () => {
    if (!aiPrompt.trim()) {
      setMessage({ text: "Please enter a description for the AI to generate a schema", type: "error" });
      return;
    }

    setAiLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(
        `${baseUrl}/api/schema/generate`,
        { prompt: aiPrompt }, 
        { withCredentials: true }
      );

      let generatedSchema = response.data;
      
      // Handle different response formats
      if (typeof generatedSchema === 'string') {
        try {
          const parsedSchema = JSON.parse(generatedSchema);
          generatedSchema = JSON.stringify(parsedSchema, null, 2);
        } catch (e) {
          generatedSchema = generatedSchema.replace(/\\n/g, '\n');
          generatedSchema = generatedSchema.replace(/\\t/g, '\t');
          generatedSchema = generatedSchema.replace(/\\"/g, '"');
        }
      } else {
        generatedSchema = JSON.stringify(generatedSchema, null, 2);
      }
      
      setSchema(generatedSchema);
      setActiveTab("manual");
      setMessage({ text: "Schema generated successfully!", type: "success" });

    } catch (err) {
      console.error("AI generation error:", err);
      setMessage({
        text: "Error generating schema: " + (err.response?.data?.message || err.message),
        type: "error"
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    // Validate name
    if (!name.trim()) {
      setMessage({ text: "API name is required", type: "error" });
      return;
    }

    try {
      let finalSchema = schema;
      
      if (formMode) {
        // Build schema from form
        const schemaFromForm = {
          $schema: "http://json-schema.org/draft-07/schema#",
          title: name,
          type: "object",
          properties: {},
          required: requiredFields
        };

        fields.forEach((f) => {
          if (f.name.trim()) {
            schemaFromForm.properties[f.name] = {
              type: f.type,
              description: f.description
            };
            if (f.enum && f.enum.length > 0) {
              schemaFromForm.properties[f.name].enum = f.enum;
            }
          }
        });

        finalSchema = JSON.stringify(schemaFromForm, null, 2);
      }
      
      // Validate JSON
      if (!formMode && !finalSchema.trim()) {
        setMessage({ text: "JSON Schema is required", type: "error" });
        return;
      }

      const parsedSchema = JSON.parse(finalSchema);
      const valid = ajv.validateSchema(parsedSchema);
      if (!valid) {
        setMessage({
          text: "Invalid JSON Schema: " + JSON.stringify(ajv.errors, null, 2),
          type: "error"
        });
        return;
      }

      setLoading(true);

      if (isUpdateMode && existingApi) {
        // Update existing schema
        const response = await axios.put(
          `${baseUrl}/apis/${existingApi.name}`,
          { name, schemaJson: finalSchema },
          { withCredentials: true }
        );

        setMessage({
          text: `Schema "${response.data.name}" updated successfully!`,
          type: "success"
        });
        
        // Navigate back after successful update
        setTimeout(() => {
          navigate('/apis');
        }, 2000);
      } else {
        // Create new schema
        const response = await axios.post(
          `${baseUrl}/apis`,
          { name, schemaJson: finalSchema },
          { withCredentials: true }
        );

        setMessage({
          text: `Schema "${response.data.name}" uploaded successfully!`,
          type: "success"
        });
        
        // Reset form after successful creation
        setTimeout(() => {
          resetForm();
        }, 2000);
      }
      
    } catch (err) {
      console.error("Submit error:", err);
      setMessage({
        text: "Error: " + (err.response?.data?.message || err.message || "Something went wrong"),
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setSchema("");
    setFields([]);
    setRequiredFields([]);
    setExampleVisible(false);
    setIsUpdateMode(false);
    setExistingApi(null);
    setAiPrompt("");
    setMessage({ text: "", type: "" });
    setActiveTab("manual");
    setFormMode(false);
  };

  const toggleExample = () => {
    if (exampleVisible) {
      setSchema("");
    } else {
      setSchema(`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Product API",
  "description": "A comprehensive product management API",
  "type": "object",
  "properties": {
    "id": { 
      "type": "integer", 
      "description": "Unique product identifier" 
    },
    "name": { 
      "type": "string", 
      "description": "Product name",
      "minLength": 1,
      "maxLength": 100
    },
    "price": { 
      "type": "number", 
      "minimum": 0,
      "description": "Product price in USD" 
    },
    "category": { 
      "type": "string", 
      "enum": ["electronics", "clothing", "books", "home"],
      "description": "Product category"
    },
    "inStock": { 
      "type": "boolean", 
      "description": "Availability status" 
    },
    "tags": { 
      "type": "array", 
      "items": { "type": "string" }, 
      "minItems": 0,
      "uniqueItems": true,
      "description": "Product tags"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "createdAt": { "type": "string", "format": "date-time" },
        "updatedAt": { "type": "string", "format": "date-time" },
        "rating": { "type": "number", "minimum": 0, "maximum": 5 }
      }
    }
  },
  "required": ["id", "name", "price", "category"]
}`);
    }
    setExampleVisible(!exampleVisible);
  };

  const copyExample = () => {
    navigator.clipboard.writeText(`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Product API",
  "description": "A comprehensive product management API",
  "type": "object",
  "properties": {
    "id": { 
      "type": "integer", 
      "description": "Unique product identifier" 
    },
    "name": { 
      "type": "string", 
      "description": "Product name",
      "minLength": 1,
      "maxLength": 100
    },
    "price": { 
      "type": "number", 
      "minimum": 0,
      "description": "Product price in USD" 
    },
    "category": { 
      "type": "string", 
      "enum": ["electronics", "clothing", "books", "home"],
      "description": "Product category"
    },
    "inStock": { 
      "type": "boolean", 
      "description": "Availability status" 
    },
    "tags": { 
      "type": "array", 
      "items": { "type": "string" }, 
      "minItems": 0,
      "uniqueItems": true,
      "description": "Product tags"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "createdAt": { "type": "string", "format": "date-time" },
        "updatedAt": { "type": "string", "format": "date-time" },
        "rating": { "type": "number", "minimum": 0, "maximum": 5 }
      }
    }
  },
  "required": ["id", "name", "price", "category"]
}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = () => {
    navigate('/apis');
  };

  // Debug function to test clicks
  const handleTestClick = (buttonName) => {
    console.log(`Button clicked: ${buttonName}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-4 pb-8 relative z-10">
      {/* REMOVED Mouse follower to fix click issues */}
      
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 z-20">
        
        {/* Header with mode indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-75 animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-12 transition-all duration-300">
                <CodeBracketIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200">
                {isUpdateMode ? "Update API Schema" : "Upload New API Schema"}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed mt-2 max-w-3xl">
                {isUpdateMode 
                  ? "Modify your existing JSON Schema. Changes will be reflected in your API endpoints."
                  : "Create testable API endpoints by uploading JSON Schema definitions."}
              </p>
            </div>
          </div>
          
          <div className={`px-6 py-3 rounded-2xl flex items-center backdrop-blur-sm shadow-lg border ${isUpdateMode ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-200' : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-200'}`}>
            <div className={`w-3 h-3 rounded-full mr-3 animate-pulse ${isUpdateMode ? 'bg-blue-400' : 'bg-green-400'}`}></div>
            <span className="text-sm font-bold">
              {isUpdateMode ? 'Update Mode' : 'Upload Mode'}
            </span>
          </div>
        </div>
        
        {/* Mode Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => {
              setFormMode(false);
              handleTestClick('JSON Mode');
            }}
            className={`group px-6 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border relative z-30 ${
              !formMode 
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500/50 shadow-lg shadow-purple-500/25" 
                : "bg-gray-800/50 text-gray-300 hover:text-white hover:bg-white/10 border-gray-700/50"
            }`}
          >
            <CodeBracketIcon className="w-5 h-5 inline mr-2 group-hover:scale-110 transition-transform" />
            JSON Mode
          </button>
          <button
            type="button"
            onClick={() => {
              setFormMode(true);
              handleTestClick('Form Mode');
            }}
            className={`group px-6 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border relative z-30 ${
              formMode 
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500/50 shadow-lg shadow-purple-500/25" 
                : "bg-gray-800/50 text-gray-300 hover:text-white hover:bg-white/10 border-gray-700/50"
            }`}
          >
            <PencilSquareIcon className="w-5 h-5 inline mr-2 group-hover:scale-110 transition-transform" />
            Form Mode
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="w-full lg:w-2/3">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-purple-500/20 overflow-hidden shadow-2xl relative z-20">
              <div className="relative p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* API Name Field */}
                  <div>
                    <label htmlFor="apiName" className="block text-lg font-bold text-white mb-4">
                      API Name <span className="text-pink-400">*</span>
                    </label>
                    <input
                      id="apiName"
                      type="text"
                      className="w-full px-6 py-4 bg-gray-900/50 border border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm relative z-20"
                      placeholder="e.g., UserProfileAPI, ProductCatalog"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <p className="mt-3 text-sm text-gray-400">
                      Choose a descriptive name that identifies your API
                    </p>
                  </div>

                  {/* Schema Input Tabs */}
                  <div>
                    <div className="flex border-b border-gray-700/50 mb-6 relative z-20">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("manual");
                          handleTestClick('Manual Tab');
                        }}
                        className={`py-3 px-6 font-bold text-sm transition-all duration-300 relative z-30 ${activeTab === "manual" ? "border-b-2 border-purple-500 text-purple-400" : "text-gray-400 hover:text-white"}`}
                      >
                        Manual Schema Input
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("ai");
                          handleTestClick('AI Tab');
                        }}
                        className={`py-3 px-6 font-bold text-sm transition-all duration-300 relative z-30 ${activeTab === "ai" ? "border-b-2 border-purple-500 text-purple-400" : "text-gray-400 hover:text-white"}`}
                      >
                        <SparklesIcon className="w-4 h-4 inline mr-2" />
                        AI Schema Generator
                      </button>
                    </div>

                    {activeTab === "ai" ? (
                      <div className="space-y-6 relative z-20">
                        <div>
                          <label htmlFor="aiPrompt" className="block text-lg font-bold text-white mb-4">
                            Describe Your API
                          </label>
                          <textarea
                            id="aiPrompt"
                            rows={4}
                            className="w-full p-6 bg-gray-900/50 border border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm relative z-20"
                            placeholder="Describe the API you want to create. For example: 'Create a login API with username, password, and remember me fields'"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                          />
                          <p className="mt-3 text-sm text-gray-400">
                            Be as specific as possible for better results
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            generateSchemaWithAI();
                            handleTestClick('AI Generate');
                          }}
                          disabled={aiLoading}
                          className="group flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-purple-400 disabled:to-pink-400 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:-translate-y-1 relative z-30"
                        >
                          {aiLoading ? (
                            <>
                              <ArrowPathIcon className="h-6 w-6 animate-spin" />
                              Generating Schema...
                            </>
                          ) : (
                            <>
                              <SparklesIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                              Generate Schema with AI
                            </>
                          )}
                        </button>
                      </div>
                    ) : formMode ? (
                      <div className="relative z-20">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-white">Schema Fields</h3>
                          <button
                            type="button"
                            onClick={() => {
                              addField();
                              handleTestClick('Add Field');
                            }}
                            className="group flex items-center gap-2 text-purple-400 hover:text-white text-sm font-semibold transition-colors relative z-30"
                          >
                            <PlusIcon className="h-5 w-5 group-hover:scale-110 transition-transform" /> Add Field
                          </button>
                        </div>

                        {/* Form fields for schema creation */}
                        <div className="space-y-4">
                          {fields.map((field, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-4 bg-gray-900/50 border border-gray-700/50 rounded-2xl backdrop-blur-sm relative z-20">
                              <input
                                placeholder="Field name"
                                className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all relative z-20"
                                value={field.name}
                                onChange={(e) => updateField(idx, "name", e.target.value)}
                              />
                              <select
                                value={field.type}
                                onChange={(e) => updateField(idx, "type", e.target.value)}
                                className="px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-purple-500 transition-all relative z-20"
                              >
                                <option value="string">string</option>
                                <option value="number">number</option>
                                <option value="integer">integer</option>
                                <option value="boolean">boolean</option>
                                <option value="array">array</option>
                                <option value="object">object</option>
                              </select>
                              <input
                                placeholder="Description"
                                className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all relative z-20"
                                value={field.description}
                                onChange={(e) =>
                                  updateField(idx, "description", e.target.value)
                                }
                              />
                              <label className="flex items-center gap-2 text-sm text-gray-300">
                                <input
                                  type="checkbox"
                                  checked={requiredFields.includes(field.name)}
                                  onChange={() => toggleRequired(field.name)}
                                  className="rounded focus:ring-purple-500 text-purple-500 relative z-20"
                                />
                                Required
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  removeField(idx);
                                  handleTestClick('Remove Field');
                                }}
                                className="text-red-400 hover:text-red-300 transition-colors relative z-30"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* JSON Schema Field */
                      <div className="relative z-20">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                          <label htmlFor="jsonSchema" className="text-lg font-bold text-white mb-3 sm:mb-0">
                            JSON Schema <span className="text-pink-400">*</span>
                          </label>
                          <div className="flex space-x-3">
                            <button
                              type="button"
                              onClick={() => {
                                toggleExample();
                                handleTestClick('Example Toggle');
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-400 hover:text-white hover:bg-white/10 rounded-xl transition-all backdrop-blur-sm border border-blue-500/30 relative z-30"
                            >
                              <LightBulbIcon className="h-4 w-4" />
                              {exampleVisible ? 'Hide Example' : 'Show Example'}
                            </button>
                            {exampleVisible && (
                              <button
                                type="button"
                                onClick={() => {
                                  copyExample();
                                  handleTestClick('Copy Example');
                                }}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-green-400 hover:text-white hover:bg-white/10 rounded-xl transition-all backdrop-blur-sm border border-green-500/30 relative z-30"
                              >
                                <DocumentDuplicateIcon className="h-4 w-4" />
                                {copied ? 'Copied!' : 'Copy'}
                              </button>
                            )}
                            {isUpdateMode && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleCancel();
                                  handleTestClick('Cancel');
                                }}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all backdrop-blur-sm border border-gray-600/30 relative z-30"
                              >
                                <XMarkIcon className="h-4 w-4" />
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="relative">
                          <textarea
                            id="jsonSchema"
                            rows={16}
                            className={`w-full p-6 font-mono text-sm rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 backdrop-blur-sm relative z-20 ${
                              !isValidJson && schema ? 'border-red-500/50 bg-red-900/20 text-red-200' : 'border-gray-700/50 bg-gray-900/50 text-gray-100'
                            }`}
                            placeholder='Paste your JSON Schema here (e.g., { "type": "object", "properties": { ... } })'
                            value={schema}
                            onChange={(e) => setSchema(e.target.value)}
                            required={!formMode}
                          />
                          {!isValidJson && schema && (
                            <div className="absolute top-4 right-4 bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-2 rounded-xl text-xs flex items-center gap-2 backdrop-blur-sm relative z-30">
                              <ExclamationTriangleIcon className="h-4 w-4" />
                              Invalid JSON
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 flex items-center text-sm text-gray-400">
                          <SparklesIcon className="h-4 w-4 mr-2 text-purple-400" />
                          Supports all JSON Schema draft versions
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-6 flex gap-4 relative z-20">
                    <button
                      type="submit"
                      disabled={loading || (!formMode && !isValidJson && schema)}
                      className="group flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:-translate-y-1 disabled:transform-none disabled:shadow-none relative z-30"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          {isUpdateMode ? 'Updating Schema...' : 'Uploading Schema...'}
                        </>
                      ) : (
                        <>
                          {isUpdateMode ? (
                            <>
                              <PencilSquareIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                              Update API Schema
                            </>
                          ) : (
                            <>
                              <ArrowUpTrayIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                              Upload API Schema
                            </>
                          )}
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        handleCancel();
                        handleTestClick('Cancel Button');
                      }}
                      className="px-8 py-4 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white font-bold rounded-2xl transition-all duration-300 border border-gray-600/50 backdrop-blur-sm relative z-30"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                {/* Message Display */}
                {message.text && (
                  <div className={`mt-8 p-6 rounded-2xl border backdrop-blur-sm relative z-20 ${
                    message.type === "error" 
                      ? 'bg-red-900/50 border-red-500/30 text-red-200' 
                      : message.type === "success"
                      ? 'bg-green-900/50 border-green-500/30 text-green-200'
                      : 'bg-blue-900/50 border-blue-500/30 text-blue-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      {message.type === "error" ? (
                        <ExclamationTriangleIcon className="h-6 w-6 mt-1 flex-shrink-0" />
                      ) : message.type === "success" ? (
                        <CheckCircleIcon className="h-6 w-6 mt-1 flex-shrink-0" />
                      ) : (
                        <LightBulbIcon className="h-6 w-6 mt-1 flex-shrink-0" />
                      )}
                      <div className="text-sm font-medium break-words">
                        {message.text}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-8 bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-8 shadow-2xl relative z-20">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <LightBulbIcon className="h-6 w-6 text-white" />
                </div>
                Schema Design Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-xs font-bold text-white">1</span>
                  </div>
                  <p className="font-medium">Use descriptive property names and descriptions for better documentation</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-xs font-bold text-white">2</span>
                  </div>
                  <p className="font-medium">Include required fields to ensure data integrity in your API</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-xs font-bold text-white">3</span>
                  </div>
                  <p className="font-medium">Add enum values for fields with limited possible values</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-xs font-bold text-white">4</span>
                  </div>
                  <p className="font-medium">Test your schema with online validators before uploading</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Info Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-8 shadow-2xl sticky top-24 relative z-20">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                {isUpdateMode ? "About Schema Updates" : "About Schema Upload"}
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <ShieldCheckIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">JSON Schema Validation</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">Automatic validation using AJV with comprehensive error reporting</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <RocketLaunchIcon className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Instant API Creation</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">Get working endpoints immediately after schema upload</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <CpuChipIcon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">AI Schema Generation</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">Describe your API in natural language and let AI generate the schema</p>
                  </div>
                </div>
                
                {isUpdateMode && (
                  <div className="bg-gradient-to-r from-yellow-900/50 to-amber-900/50 border border-yellow-500/30 rounded-2xl p-6 mt-6 backdrop-blur-sm">
                    <h4 className="font-bold text-yellow-200 mb-3 flex items-center gap-2">
                      <ExclamationTriangleIcon className="h-5 w-5" />
                      Update Notice
                    </h4>
                    <p className="text-sm text-yellow-300 leading-relaxed">
                      Updating a schema will affect all existing endpoints. Make sure to test your changes thoroughly.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}