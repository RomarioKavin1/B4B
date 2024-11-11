// services/bobGatewayService.ts
import { GatewaySDK, GatewayQuoteParams } from "@gobob/bob-sdk";
import { parseUnits } from "viem";
import { useSendGatewayTransaction } from "@gobob/sats-wagmi";
import { useState, useMemo } from "react";

interface ExecutionResult {
  success: boolean;
  txHash?: string;
  error?: string;
  details?: any;
}
type BlockValues = Record<string, Record<string, string>>;

export class BobGatewayService {
  private sdk: GatewaySDK;

  constructor() {
    // Initialize with bob-sepolia for testnet
    this.sdk = new GatewaySDK("bob-sepolia");
  }

  private async createQuoteParams(
    values: Record<string, string>,
    targetToken: string,
    strategy?: any
  ): Promise<GatewayQuoteParams> {
    // Convert BTC amount to sats (1 BTC = 100,000,000 sats)
    const btcAmount = parseFloat(values.Amount || "0");
    const satsAmount = Math.floor(btcAmount * 100000000);

    console.log("Creating quote with values:", {
      btcAmount,
      satsAmount,
      bobAddress: values["BOB Address"],
      targetChain: values["Target Chain"],
    });

    const baseParams: GatewayQuoteParams = {
      fromToken: "BTC",
      fromChain: "Bitcoin",
      // fromUserAddress will be set by sats-wagmi
      fromUserAddress: "",
      toChain: "bob-sepolia", // Always use bob-sepolia for testnet
      toUserAddress: values["BOB Address"],
      toToken: "tBTC", // Use tBTC for testnet
      amount: satsAmount,
      gasRefill: 10000, // 0.0001 BTC for gas
    };

    console.log("Created quote params:", baseParams);

    return baseParams;
  }

  async executePath(
    blocks: BlockType[],
    values: Record<string, Record<string, string>>
  ): Promise<ExecutionResult> {
    try {
      const firstBlock = blocks[0];
      const firstBlockValues = values[`chain-0`] || {};

      if (firstBlock.id !== "bridge_btc") {
        throw new Error("First block must be Bridge BTC");
      }

      // Get available tokens
      const outputTokens = await this.sdk.getTokens();
      console.log("Available tokens:", outputTokens);

      // Create quote parameters
      const quoteParams = await this.createQuoteParams(
        firstBlockValues,
        "tBTC" // Always use tBTC for testnet
      );

      // Get quote
      console.log("Getting quote with params:", quoteParams);
      const quote = await this.sdk.getQuote(quoteParams);
      console.log("Received quote:", quote);

      // Start order
      console.log("Starting order...");
      const { uuid, psbtBase64 } = await this.sdk.startOrder(
        quote,
        quoteParams
      );
      console.log("Order started:", { uuid, psbtHasData: !!psbtBase64 });

      return {
        success: true,
        details: {
          uuid,
          psbtBase64,
          quote,
          targetToken: "tBTC",
        },
      };
    } catch (error) {
      console.error("BOB Gateway error:", error);
      if (error instanceof Error) {
        return {
          success: false,
          error: error.message,
        };
      }
      return {
        success: false,
        error: "An unknown error occurred",
      };
    }
  }
}

export const useBobGateway = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const service = useMemo(() => new BobGatewayService(), []);
  const { sendGatewayTransaction } = useSendGatewayTransaction({
    toChain: "bob-sepolia", // Always use bob-sepolia for testnet
  });

  const executePath = async (
    blocks: BlockType[],
    values: Record<string, Record<string, string>>
  ) => {
    setIsExecuting(true);

    try {
      console.log("Starting BOB Gateway execution...");
      const result = await service.executePath(blocks, values);

      if (!result.success || !result.details) {
        throw new Error(result.error || "Failed to prepare transaction");
      }

      console.log("Sending gateway transaction...");
      const txHash = await sendGatewayTransaction({
        toToken: "tBTC", // Always use tBTC for testnet
        evmAddress: values[`chain-0`]?.["BOB Address"] || "",
        value: BigInt(result.details.quote.amount),
      });

      console.log("Transaction sent:", txHash);

      return {
        success: true,
        txHash: txHash as unknown as string,
      };
    } catch (error) {
      console.error("Execution error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    executePath,
    isExecuting,
  };
};
