interface BlockType {
  id: string;
  name: string;
  color: string;
  icon: any;
  description: string;
  compatibleWith: string[];
  inputs?: {
    type: "number" | "text" | "address" | "select";
    label: string;
    placeholder?: string;
    options?: string[];
    required?: boolean;
    unit?: string;
  }[];
  category: "intent" | "defi" | "privacy" | "ai" | "betting" | "bridge";
  outputDescription?: string;
}
