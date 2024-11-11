interface BlockType {
  id: string;
  name: string;
  color: string;
  icon: React.ElementType;
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

interface BlockValues {
  [key: string]: {
    [key: string]: string;
  };
}

interface GasEstimates {
  totalGas: number;
  totalTime: number;
}

interface TransactionFlowVisualizerProps {
  blocks: BlockType[];
  values: BlockValues;
}
