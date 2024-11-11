import { Tag, Coins, Lock } from "lucide-react";
import {
  ArrowRightLeft,
  BrainCircuit,
  CircuitBoard,
  FileCode,
  Send,
} from "lucide-react";
export const blocks: BlockType[] = [
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
        label: "BOB Address",
        placeholder: "0x...", // Must be 0x format
        required: true,
      },
      {
        type: "select",
        label: "Target Chain",
        options: ["BOB Sepolia"],
        required: true,
      },
    ],
    compatibleWith: ["create_intent"],
  },
  {
    id: "create_intent",
    name: "Create Intent",
    color: "from-blue-400 to-blue-600",
    icon: Tag,
    description: "Create Bitcoin intent for transaction",
    category: "intent",
    inputs: [
      {
        type: "select",
        label: "Intent Type",
        options: ["Swap", "Lend", "Stake", "Bridge"],
        required: true,
      },
      {
        type: "number",
        label: "Timeout (minutes)",
        placeholder: "30",
        required: true,
      },
    ],
    compatibleWith: ["execute_intent", "verify_intent"],
  },
  {
    id: "swap_intent",
    name: "Swap Intent",
    color: "from-green-400 to-green-600",
    icon: ArrowRightLeft,
    description: "Create swap-specific intent",
    category: "intent",
    inputs: [
      {
        type: "text",
        label: "Target Token",
        placeholder: "ETH/USDC/etc",
        required: true,
      },
      {
        type: "number",
        label: "Min Amount Out",
        placeholder: "0.0",
        required: true,
      },
    ],
    compatibleWith: ["execute_intent", "verify_intent"],
  },
  {
    id: "verify_intent",
    name: "Verify Intent",
    color: "from-yellow-400 to-yellow-600",
    icon: BrainCircuit,
    description: "Verify intent parameters and conditions",
    category: "intent",
    inputs: [
      {
        type: "select",
        label: "Verification Type",
        options: ["Parameters", "Signature", "Full"],
        required: true,
      },
    ],
    compatibleWith: ["execute_intent"],
  },
  {
    id: "execute_intent",
    name: "Execute Intent",
    color: "from-purple-400 to-purple-600",
    icon: CircuitBoard,
    description: "Execute the prepared Bitcoin intent",
    category: "intent",
    inputs: [
      {
        type: "select",
        label: "Execution Mode",
        options: ["Normal", "Fast", "Secure"],
        required: true,
      },
    ],
    compatibleWith: ["smart_contract", "send_transaction"],
  },
  {
    id: "smart_contract",
    name: "Smart Contract",
    color: "from-indigo-400 to-indigo-600",
    icon: FileCode,
    description: "Interact with smart contract",
    category: "defi",
    inputs: [
      {
        type: "text",
        label: "Contract Address",
        placeholder: "0x...",
        required: true,
      },
      {
        type: "select",
        label: "Action",
        options: ["Swap", "Add Liquidity", "Remove Liquidity", "Stake"],
        required: true,
      },
    ],
    compatibleWith: ["send_transaction"],
  },
  {
    id: "send_transaction",
    name: "Send Transaction",
    color: "from-red-400 to-red-600",
    icon: Send,
    description: "Submit the transaction",
    category: "bridge",
    inputs: [
      {
        type: "select",
        label: "Gas Priority",
        options: ["Low", "Medium", "High"],
        required: true,
      },
    ],
    compatibleWith: [],
  },
];
