import { cn } from "../../../lib/utils";
import CMSButton from "./CMSButton";

export default function CMSDialog({
  isOpen,
  title,
  description,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-neutral-950/20 backdrop-blur-xs transition-opacity" 
      />

      {/* Wrapper */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all w-full max-w-md border border-neutral-200">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold text-neutral-900 leading-6">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-neutral-500">
                {description}
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <CMSButton 
              variant="secondary" 
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </CMSButton>
            <CMSButton 
              variant={variant} 
              onClick={onConfirm}
              loading={loading}
            >
              {confirmText}
            </CMSButton>
          </div>
        </div>
      </div>
    </div>
  );
}
