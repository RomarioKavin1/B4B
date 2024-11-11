const BlockInput: React.FC<{
  input: {
    type: "number" | "text" | "address" | "select";
    label: string;
    placeholder?: string;
    options?: string[];
    required?: boolean;
    unit?: string;
  };
  value: string;
  onChange: (value: string) => void;
}> = ({ input, value, onChange }) => {
  const inputClasses =
    "w-full px-2.5 py-1.5 rounded bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-sm";

  switch (input.type) {
    case "select":
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
        >
          <option value="">Select...</option>
          {input.options?.map((option: string) => (
            <option key={option} value={option} className="bg-gray-700">
              {option}
            </option>
          ))}
        </select>
      );
    case "number":
      return (
        <div className="relative">
          <input
            type="number"
            placeholder={input.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClasses} ${input.unit ? "pr-9" : ""}`}
          />
          {input.unit && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/70 text-xs">
              {input.unit}
            </span>
          )}
        </div>
      );
    default:
      return (
        <input
          type="text"
          placeholder={input.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
        />
      );
  }
};
export default BlockInput;
