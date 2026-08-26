import { cn } from "../../../lib/utils";

export default function CMSButton({
  children,
  className,
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  ...props
}) {
  const variants = {
    primary: "bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-400 focus:ring-neutral-900",
    secondary: "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 disabled:text-neutral-400 focus:ring-neutral-200",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 focus:ring-red-600",
    ghost: "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 focus:ring-neutral-100"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
