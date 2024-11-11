import { GatewaySDK, GatewayQuoteParams, GatewayQuote } from "@gobob/bob-sdk";
import { parseUnits } from "viem";
import { useAccount, useSendGatewayTransaction } from "@gobob/sats-wagmi";
import { useState, useMemo } from "react";

// Initialize SDK with just the network name
const sdk = new GatewaySDK("bob-sepolia");

interface ExecutionResult {
  success: boolean;
  error?: string;
  details?: {
    uuid?: string;
    psbtBase64?: string;
    quote?: GatewayQuote;
    targetToken?: string;
  };
}

export class BobGatewayService {
  private async createQuoteParams(
    values: Record<string, string>,
    fromBtcAddress: string
  ): Promise<GatewayQuoteParams> {
    const btcAmount = parseFloat(values.Amount || "0");
    const satsAmount = Math.floor(btcAmount * 100000000);

    console.log("Creating quote with values:", {
      btcAmount,
      satsAmount,
      fromBtcAddress,
      toAddress: values["BOB Address"],
    });

    // Validate addresses
    if (
      !fromBtcAddress?.startsWith("tb1") &&
      !fromBtcAddress?.startsWith("bc1")
    ) {
      throw new Error("Invalid Bitcoin sender address format");
    }

    if (!values["BOB Address"]?.startsWith("0x")) {
      throw new Error("Invalid BOB address format - must start with 0x");
    }

    return {
      fromToken: "BTC",
      fromChain: "Bitcoin",
      fromUserAddress: fromBtcAddress,
      toChain: "bob-sepolia",
      toUserAddress: values["BOB Address"],
      toToken: "tBTC",
      amount: satsAmount,
      gasRefill: 10000, // 0.0001 BTC for gas
    };
  }

  async executePath(
    blocks: BlockType[],
    values: Record<string, Record<string, string>>,
    fromBtcAddress: string
  ): Promise<ExecutionResult> {
    try {
      const firstBlockValues = values[`chain-0`] || {};

      // Use SDK to get available tokens
      const tokens = await sdk.getTokens();
      console.log("Available tokens:", tokens);

      // Find tBTC token details
      const tbtcToken = tokens.find((t) => t.symbol === "tBTC");
      if (!tbtcToken) {
        throw new Error("tBTC token not found on BOB Sepolia");
      }

      // Create quote parameters
      const quoteParams = await this.createQuoteParams(
        firstBlockValues,
        fromBtcAddress
      );

      // Use SDK to get quote
      const quote = await sdk.getQuote(quoteParams);
      console.log("Quote received:", quote);

      // Use SDK to start order
      const { uuid, psbtBase64 } = await sdk.startOrder(quote, quoteParams);
      console.log("Order started:", { uuid, psbtBase64 });

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
    toChain: "bob-sepolia",
  });
  const { address: btcAddress } = useAccount();

  const executePath = async (
    blocks: BlockType[],
    values: Record<string, Record<string, string>>
  ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
    setIsExecuting(true);

    try {
      if (!btcAddress) {
        throw new Error("Please connect your Bitcoin wallet first");
      }

      console.log(
        "Starting BOB Gateway execution with BTC address:",
        btcAddress
      );
      const result = await service.executePath(blocks, values, btcAddress);

      if (!result.success || !result.details) {
        throw new Error(result.error || "Failed to prepare transaction");
      }

      console.log("Sending gateway transaction with details:", result.details);

      try {
        // Use sats-wagmi to send the transaction
        const txResponse = await sendGatewayTransaction({
          toToken: "tBTC",
          evmAddress: values[`chain-0`]?.["BOB Address"] || "",
          value: BigInt(result.details.quote?.satoshis || 0),
        });

        // Handle the response based on sats-wagmi types
        if (typeof txResponse === "string") {
          console.log("Transaction sent with hash:", txResponse);
          return {
            success: true,
            txHash: txResponse,
          };
        } else {
          throw new Error("Invalid transaction response format");
        }
      } catch (txError) {
        console.error("Transaction error:", txError);
        throw new Error(
          txError instanceof Error
            ? txError.message
            : "Failed to send transaction"
        );
      }
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
