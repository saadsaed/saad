import { cn } from "../../../lib/utils";

export default function CMSFormInput({
  label,
  id,
  type = "text",
  error,
  helperText,
  className,
  textarea = false,
  rows = 4,
  ...props
}) {
  const inputClasses = cn(
    "mt-1 block w-full px-3 py-2 bg-white border border-neutral-300 rounded-md shadow-xs text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-500",
    error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-neutral-300",
    className
  );

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      {textarea ? (
        <textarea
          id={id}
          rows={rows}
          className={inputClasses}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={inputClasses}
          {...props}
        />
      )}
      {error && (
        <span className="text-xs text-red-600 mt-1 font-medium">{error}</span>
      )}
      {!error && helperText && (
        <span className="text-xs text-neutral-400 mt-1">{helperText}</span>
      )}
    </div>
  );
}
