import { Tag, Coins, Lock } from "lucide-react";
export const blocks: BlockType[] = [
  // BOB Gateway Intents
  {
    id: "bridge_btc",
    name: "Bridge BTC",
    color: "from-orange-400 to-orange-600",
    icon: Coins,
    description: "Bridge native BTC to smart contracts",
    category: "bridge",
    inputs: [
      {
        type: "number",
        label: "Amount",
        placeholder: "0.0",
        required: true,
        unit: "BTC",
      },
      {
        type: "address",
        label: "Target Chain Address",
        required: true,
      },
    ],
    compatibleWith: ["intent_create", "smart_contract_interact"],
  },
  {
    id: "intent_create",
    name: "Create Intent",
    color: "from-blue-400 to-blue-600",
    icon: Tag,
    description: "Create Bitcoin intents",
    category: "intent",
    inputs: [
      {
        type: "select",
        label: "Intent Type",
        options: ["Swap", "Lend", "Stake"],
        required: true,
      },
    ],
    compatibleWith: ["intent_execute"],
  },
  // Privacy Features
  {
    id: "private_swap",
    name: "Private Swap",
    color: "from-purple-400 to-purple-600",
    icon: Lock,
    description: "Execute private token swaps",
    category: "privacy",
    inputs: [
      {
        type: "number",
        label: "Amount",
        placeholder: "0.0",
        required: true,
      },
      {
        type: "select",
        label: "Privacy Level",
        options: ["ZKP", "TEE", "FHE"],
        required: true,
      },
    ],
    compatibleWith: ["private_transfer", "zkp_generate"],
  },
];
