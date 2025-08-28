import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
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
  ArrowPathIcon
} from "@heroicons/react/24/outline";

const ajv = new Ajv();

export default function UploadSchema() {
  const [name, setName] = useState("");
  const [schema, setSchema] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [exampleVisible, setExampleVisible] = useState(false);
  const [isValidJson, setIsValidJson] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [existingSchemas, setExistingSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState("");
  const [formMode, setFormMode] = useState(false);
  const [fields, setFields] = useState([]);
  const [requiredFields, setRequiredFields] = useState([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("manual"); // "manual" or "ai"
 
  const location = useLocation();
  const existingApiName = location.state?.existingApi;
  
  useEffect(() => {
    if (existingApiName) {
      getSchemadetails(existingApiName);
    }
  }, [existingApiName]);

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

  const getSchemadetails = async (existingApiName) => {
    try {
      // console.log(existingApiName);
      setSelectedSchema(existingApiName);
      const response = await axios.get(
        `http://localhost:8080/apis/${existingApiName.name}`,
        { withCredentials: true }
      );
      
      setName(response.data.name);
      let formattedSchema = response.data.schemaJson;
      
      if (typeof formattedSchema === 'string') {
        try {
          // Try to parse and format the JSON
          const parsedSchema = JSON.parse(formattedSchema);
          formattedSchema = JSON.stringify(parsedSchema, null, 2);
        } catch (e) {
          // If it's already a string with escaped characters, clean it up
          formattedSchema = formattedSchema.replace(/\\n/g, '\n');
          formattedSchema = formattedSchema.replace(/\\t/g, '\t');
          formattedSchema = formattedSchema.replace(/\\"/g, '"');
        }
      }
      
      setSchema(formattedSchema);
      setIsUpdateMode(true);
      setMessage({ text: `Loaded schema "${response.data.name}" for editing.`, type: "info" });
      
    } catch (err) {
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
        "http://localhost:8080/api/schema/generate",
        { prompt: aiPrompt }, 
        { headers: { "Content-Type": "application/json" } }
      );

      let parsedResponse = response.data;
      
      // Handle different response formats from AI
      if (typeof parsedResponse === 'string') {
        try {
          parsedResponse = JSON.parse(parsedResponse);
        } catch (e) {
          // If it's a string that can't be parsed, treat it as the schema itself
          setSchema(parsedResponse);
          setActiveTab("manual");
          setMessage({ text: "Schema generated successfully!", type: "success" });
          setAiLoading(false);
          return;
        }
      }
      
      // Handle the case where schema is nested in a "schema" property
      let generatedSchema = parsedResponse.schema || parsedResponse;
      
      // If the schema is still a string, try to parse and format it
      if (typeof generatedSchema === 'string') {
        try {
          const parsedSchema = JSON.parse(generatedSchema);
          generatedSchema = JSON.stringify(parsedSchema, null, 2);
        } catch (e) {
          // If parsing fails, clean up the string format
          generatedSchema = generatedSchema.replace(/\\n/g, '\n');
          generatedSchema = generatedSchema.replace(/\\t/g, '\t');
          generatedSchema = generatedSchema.replace(/\\"/g, '"');
        }
      } else {
        // If it's already an object, stringify with formatting
        generatedSchema = JSON.stringify(generatedSchema, null, 2);
      }
      
      setSchema(generatedSchema);
      setActiveTab("manual");
      setMessage({ text: "Schema generated successfully!", type: "success" });

    } catch (err) {
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

    try {
      let finalSchema = schema;
      
      if (formMode) {
        // build schema from form
        const schemaFromForm = {
          $schema: "http://json-schema.org/draft-07/schema#",
          title: name,
          type: "object",
          properties: {},
          required: requiredFields
        };

        fields.forEach((f) => {
          schemaFromForm.properties[f.name] = {
            type: f.type,
            description: f.description
          };
          if (f.enum && f.enum.length > 0) {
            schemaFromForm.properties[f.name].enum = f.enum;
          }
        });

        finalSchema = JSON.stringify(schemaFromForm, null, 2);
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
      console.log("selected schema",existingApiName);
      console.log("name",name);

      if (isUpdateMode && selectedSchema) {
        // Update existing schema
        const response = await axios.put(
          `http://localhost:8080/apis/${selectedSchema.name}`,
          { name, schemaJson: finalSchema },
          { withCredentials: true }
        );

        setMessage({
          text: `Schema "${response.data.name}" updated successfully!`,
          type: "success"
        });
      } else {
        // Create new schema
        const response = await axios.post(
          "http://localhost:8080/apis",
          { name, schemaJson: finalSchema },
          { withCredentials: true }
        );

        setMessage({
          text: `Schema "${response.data.name}" uploaded successfully!`,
          type: "success"
        });
      }
      
      // Reset form
      setName("");
      setSchema("");
      setFields([]);
      setRequiredFields([]);
      setExampleVisible(false);
      setIsUpdateMode(false);
      setSelectedSchema("");
      setAiPrompt("");
    } catch (err) {
      setMessage({
        text: "Error: " + (err.response?.data?.message || err.message),
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
    setSelectedSchema("");
    setAiPrompt("");
    setMessage({ text: "", type: "" });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-4 pb-8">
      {/* Accounting for navbar height */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        {/* Header with mode indicator */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isUpdateMode ? "Update API Schema" : "Upload New API Schema"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isUpdateMode 
                ? "Modify your existing JSON Schema. Changes will be reflected in your API endpoints."
                : "Create testable API endpoints by uploading JSON Schema definitions."}
            </p>
          </div>
          
          <div className={`px-4 py-2 rounded-full flex items-center ${isUpdateMode ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${isUpdateMode ? 'bg-blue-500' : 'bg-green-500'}`}></div>
            <span className="text-sm font-medium">
              {isUpdateMode ? 'Update Mode' : 'Upload Mode'}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setFormMode(false)}
            className={`px-3 py-1 rounded-md ${
              !formMode ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            JSON Mode
          </button>
          <button
            type="button"
            onClick={() => setFormMode(true)}
            className={`px-3 py-1 rounded-md ${
              formMode ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Form Mode
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* API Name Field */}
                  <div>
                    <label htmlFor="apiName" className="block text-sm font-medium text-gray-700 mb-2">
                      API Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="apiName"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="e.g., UserProfileAPI, ProductCatalog"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Choose a descriptive name that identifies your API
                    </p>
                  </div>

                  {/* Schema Input Tabs */}
                  <div>
                    <div className="flex border-b border-gray-200 mb-4">
                      <button
                        type="button"
                        onClick={() => setActiveTab("manual")}
                        className={`py-2 px-4 font-medium text-sm ${activeTab === "manual" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                      >
                        Manual Schema Input
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("ai")}
                        className={`py-2 px-4 font-medium text-sm ${activeTab === "ai" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                      >
                        AI Schema Generator
                      </button>
                    </div>

                    {activeTab === "ai" ? (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="aiPrompt" className="block text-sm font-medium text-gray-700 mb-2">
                            Describe Your API
                          </label>
                          <textarea
                            id="aiPrompt"
                            rows={4}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Describe the API you want to create. For example: 'Create a login API with username, password, and remember me fields'"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                          />
                          <p className="mt-2 text-sm text-gray-500">
                            Be as specific as possible for better results
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={generateSchemaWithAI}
                          disabled={aiLoading}
                          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                        >
                          {aiLoading ? (
                            <>
                              <ArrowPathIcon className="h-5 w-5 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <SparklesIcon className="h-5 w-5" />
                              Generate Schema with AI
                            </>
                          )}
                        </button>
                      </div>
                    ) : formMode ? (
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-medium">Schema Fields</h3>
                          <button
                            type="button"
                            onClick={addField}
                            className="flex items-center gap-1 text-blue-600 text-sm"
                          >
                            <PlusIcon className="h-4 w-4" /> Add Field
                          </button>
                        </div>

                        {/* Form fields for schema creation */}
                        {fields.map((field, idx) => (
                          <div key={idx} className="flex items-center gap-2 mb-2">
                            <input
                              placeholder="Field name"
                              className="px-2 py-1 border rounded w-1/5"
                              value={field.name}
                              onChange={(e) => updateField(idx, "name", e.target.value)}
                            />
                            <select
                              value={field.type}
                              onChange={(e) => updateField(idx, "type", e.target.value)}
                              className="px-2 py-1 border rounded"
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
                              className="px-2 py-1 border rounded flex-1"
                              value={field.description}
                              onChange={(e) =>
                                updateField(idx, "description", e.target.value)
                              }
                            />
                            <label className="flex items-center gap-1 text-sm">
                              <input
                                type="checkbox"
                                checked={requiredFields.includes(field.name)}
                                onChange={() => toggleRequired(field.name)}
                              />
                              Required
                            </label>
                            <button
                              type="button"
                              onClick={() => removeField(idx)}
                              className="text-red-500"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* JSON Schema Field */
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <label htmlFor="jsonSchema" className="text-sm font-medium text-gray-700 mb-2 sm:mb-0">
                            JSON Schema <span className="text-red-500">*</span>
                          </label>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={toggleExample}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                            >
                              <LightBulbIcon className="h-4 w-4" />
                              {exampleVisible ? 'Hide Example' : 'Show Example'}
                            </button>
                            {exampleVisible && (
                              <button
                                type="button"
                                onClick={copyExample}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                              >
                                <DocumentDuplicateIcon className="h-4 w-4" />
                                {copied ? 'Copied!' : 'Copy'}
                              </button>
                            )}
                            {isUpdateMode && (
                              <button
                                type="button"
                                onClick={resetForm}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
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
                            rows={14}
                            className={`w-full p-4 border font-mono text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                              !isValidJson && schema ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder='Paste your JSON Schema here (e.g., { "type": "object", "properties": { ... } })'
                            value={schema}
                            onChange={(e) => setSchema(e.target.value)}
                            required={!formMode}
                          />
                          {!isValidJson && schema && (
                            <div className="absolute top-3 right-3 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                              <ExclamationTriangleIcon className="h-3 w-3" />
                              Invalid JSON
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <SparklesIcon className="h-4 w-4 mr-1 text-blue-500" />
                          Supports all JSON Schema draft versions
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading || (!formMode && !isValidJson)}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          {isUpdateMode ? 'Updating Schema...' : 'Uploading Schema...'}
                        </>
                      ) : (
                        <>
                          {isUpdateMode ? (
                            <>
                              <PencilSquareIcon className="h-5 w-5" />
                              Update API Schema
                            </>
                          ) : (
                            <>
                              <ArrowUpTrayIcon className="h-5 w-5" />
                              Upload API Schema
                            </>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Message Display */}
                {message.text && (
                  <div className={`mt-6 p-4 rounded-lg border ${
                    message.type === "error" 
                      ? 'bg-red-50 border-red-200 text-red-800' 
                      : message.type === "success"
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}>
                    <div className="flex items-start gap-3">
                      {message.type === "error" ? (
                        <ExclamationTriangleIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      ) : message.type === "success" ? (
                        <CheckCircleIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      ) : (
                        <LightBulbIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="text-sm break-words">
                        {message.text}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <LightBulbIcon className="h-5 w-5 text-yellow-500" />
                Schema Design Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">1</span>
                  </div>
                  <p>Use descriptive property names and descriptions for better documentation</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">2</span>
                  </div>
                  <p>Include required fields to ensure data integrity in your API</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">3</span>
                  </div>
                  <p>Add enum values for fields with limited possible values</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">4</span>
                  </div>
                  <p>Test your schema with online validators before uploading</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Info Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-blue-500" />
                {isUpdateMode ? "About Schema Updates" : "About Schema Upload"}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">JSON Schema Validation</h4>
                    <p className="text-sm text-gray-600">Automatic validation using AJV with comprehensive error reporting</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Instant API Creation</h4>
                    <p className="text-sm text-gray-600">Get working endpoints immediately after schema upload</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">AI Schema Generation</h4>
                    <p className="text-sm text-gray-600">Describe your API in natural language and let AI generate the schema</p>
                  </div>
                </div>
                
                {isUpdateMode && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-yellow-800 mb-1 flex items-center gap-2">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      Update Notice
                    </h4>
                    <p className="text-sm text-yellow-700">
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