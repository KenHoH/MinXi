import type { FullContentDto, UserDto } from "@/service/api";
import useContentService from "@/shared/hooks/useContentService";
import useReportService from "@/shared/hooks/useReportService";
import { useToast } from "@/shared/context/ToastContext";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { X, AlertCircle } from "lucide-react";
import { useState } from "react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: FullContentDto;
  onReportSuccess: () => void;
}

const REPORT_REASONS = [
  {
    id: 1,
    type: "Abuse",
    label: "Abuse",
    description: "Bullying or harassing behavior",
  },
  {
    id: 2,
    type: "Spam",
    label: "Spam",
    description: "Unwanted or repetitive content",
  },
  {
    id: 3,
    type: "Missinformation",
    label: "Missinformation",
    description: "False or misleading information",
  },
];

export function ReportModal({
  isOpen,
  onClose,
  content,
  onReportSuccess,
}: ReportModalProps) {
  const { user } = useAuthContext();
  const { showToast } = useToast();
  const { createReport } = useReportService();
  const { updateReport } = useContentService();

  const [selectedReason, setSelectedReason] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    if (!selectedReason.trim()) {
      setError("Please select a reason");
      return;
    }

    if (!description.trim()) {
      setError("Please provide a description");
      return;
    }

    await handleReportSubmit(selectedReason, description);
  };

  const handleReportSubmit = async (type: string, description: string) => {
    if (!user) return;

    setReportLoading(true);
    try {
      setError("");
      const [reportResult, updateResult] = await Promise.all([
        createReport({
          creator_id: content.creator_id,
          userId: user.user_id,
          desc: description,
          type: type as any,
        }),
        updateReport(content.content_id, user.area_id, {
          delta: 1,
        }),
      ]);

      if (reportResult && updateResult) {
        showToast("Report submitted successfully", "", "success");
        onReportSuccess();
      }
    } catch (error) {
      console.error("Failed to submit report:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(`Failed to submit report: ${errorMessage}`);
      showToast("Failed to submit report. Please try again.");
    } finally {
      handleClose();
      setReportLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setDescription("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-60 p-4">
      <div className="bg-black rounded-lg max-w-md w-full shadow-xl border border-dark-700">
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-white">Report Content</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Reason for Report
            </label>
            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.type)}
                  disabled={reportLoading}
                  className={`w-full text-left p-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedReason === reason.type
                      ? "bg-red-900 border-2 border-red-500"
                      : "bg-dark-700 border-2 border-transparent hover:border-dark-600"
                  }`}
                >
                  <p className="font-medium text-white">{reason.label}</p>
                  <p className="text-xs text-gray-400">{reason.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Additional Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              placeholder="Please provide more information about why you're reporting this content..."
              disabled={reportLoading}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none h-24 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">
              {description.length}/500 characters
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-900 border border-red-700 rounded-lg">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-dark-700">
          <button
            onClick={handleClose}
            disabled={reportLoading}
            className="flex-1 px-4 py-2 bg-dark-700 text-gray-200 rounded-lg hover:bg-dark-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={reportLoading}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {reportLoading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
