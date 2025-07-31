import { AlertTriangle, ExternalLink } from "lucide-react";

const DemoModeBanner = ({ onOpenSettings }) => {
  return (
    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-orange-800">
            Demo Mode Active
          </h3>
          <p className="text-sm text-orange-700 mt-1">
            Your AI API is currently unavailable. I'm providing demo responses
            to help you test the interface.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-orange-800 bg-orange-100 hover:bg-orange-200 rounded-md transition-colors"
            >
              Configure API
            </button>
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-orange-800 bg-orange-100 hover:bg-orange-200 rounded-md transition-colors"
            >
              Get API Key
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoModeBanner;
