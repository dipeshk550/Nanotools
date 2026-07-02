import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { TOOLS } from "../utils/constants";
import { useToolStore } from "../store/toolStore";
import ToolRunner from "../components/tools/ToolRunner";
import PDFToWord from "../components/tools/PDFToWord";
import Icon from "../utils/iconMap";
import ToolGrid from "../components/tools/ToolGrid";
import {
  WordCounter, CaseConverter, PasswordGenerator, HashGenerator,
  UUIDGenerator, Base64Tool, JSONFormatter, JWTDecoder, TextCompare,
  EMICalculator, CurrencyConverter, QRGenerator, LoremIpsum,
  SlugGenerator, GPACalculator,
} from "../components/tools/ToolUI";

// Map every non-AI slug to its working component
const TOOL_COMPONENTS = {
  "pdf-to-word":        PDFToWord,
  "word-counter":       WordCounter,
  "case-converter":     CaseConverter,
  "password-generator": PasswordGenerator,
  "hash-generator":     HashGenerator,
  "uuid-generator":     UUIDGenerator,
  "base64-encoder":     Base64Tool,
  "json-formatter":     JSONFormatter,
  "jwt-decoder":        JWTDecoder,
  "text-compare":       TextCompare,
  "emi-calculator":     EMICalculator,
  "currency-converter": CurrencyConverter,
  "qr-generator":       QRGenerator,
  "lorem-ipsum":        LoremIpsum,
  "slug-generator":     SlugGenerator,
  "gpa-calculator":     GPACalculator,
};

export default function ToolPage() {
  const { slug } = useParams();
  const tool = TOOLS.find((t) => t.slug === slug);

  if (!tool) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Icon name="FiAlertCircle" size={48} className="text-gray-300 mb-4" />
      <h1 className="text-lg font-medium mb-2">Tool not found</h1>
      <Link to="/" className="text-sm text-brand hover:underline flex items-center gap-1">
        <FiArrowLeft size={13} /> Back to home
      </Link>
    </div>
  );

  const related = TOOLS.filter((t) => t.category === tool.category && t.slug !== slug).slice(0, 4);
  const ToolComponent = TOOL_COMPONENTS[slug];

  const renderUI = () => {
    if (tool.isAI) return <ToolRunner tool={tool} />;
    if (ToolComponent) return <ToolComponent />;
    return (
      <div className="text-center py-10 text-gray-400">
        <Icon name={tool.icon} size={40} className="mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-500 mb-1">Coming soon</p>
        <p className="text-xs text-gray-400 max-w-xs mx-auto">
          This tool is under construction. Try an AI-powered tool in the meantime.
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 mb-4 inline-flex items-center gap-1">
        <FiArrowLeft size={11} /> All tools
      </Link>

      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center text-brand-mid shrink-0">
          <Icon name={tool.icon} size={22} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-medium">{tool.name}</h1>
            {tool.badge && (
              <span className={tool.badge === "ai" ? "badge-ai" : tool.badge === "new" ? "badge-new" : "badge-hot"}>
                {tool.badge === "ai" ? <span className="inline-flex items-center gap-0.5"><HiSparkles size={10} /> AI</span> : tool.badge === "new" ? "New" : "Hot"}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{tool.description}</p>
          <button onClick={() => useToolStore.getState().setCategory(tool.category)}
            className="text-xs text-brand mt-1 inline-flex items-center gap-1 hover:underline">
            {tool.category} <FiArrowRight size={11} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
        {renderUI()}
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-700 mb-3">Related tools</h2>
          <ToolGrid tools={related} />
        </div>
      )}
    </div>
  );
}
