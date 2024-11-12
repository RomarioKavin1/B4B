import { GatewaySDK, GatewayQuoteParams, GatewayQuote } from "@gobob/bob-sdk";
import { useAccount, useSendGatewayTransaction } from "@gobob/sats-wagmi";
import { useState, useMemo } from "react";

// Initialize SDK
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

    // Add more detailed logging
    console.log("Creating quote parameters:", {
      amount: btcAmount,
      satsAmount,
      fromBtcAddress,
      toAddress: values["BOB Address"],
      fullValues: values,
    });

    // Validate amount
    if (isNaN(btcAmount) || btcAmount <= 0) {
      throw new Error(`Invalid BTC amount: ${values.Amount}`);
    }

    if (satsAmount < 1000) {
      throw new Error(
        `Amount too small: ${satsAmount} sats (minimum 1000 sats)`
      );
    }

    // Validate addresses with detailed errors
    if (!fromBtcAddress) {
      throw new Error("Bitcoin address is missing");
    }

    if (
      !fromBtcAddress.startsWith("tb1") &&
      !fromBtcAddress.startsWith("bc1")
    ) {
      throw new Error(`Invalid Bitcoin address format: ${fromBtcAddress}`);
    }

    if (!values["BOB Address"]) {
      throw new Error("BOB address is missing");
    }

    if (!values["BOB Address"].startsWith("0x")) {
      throw new Error(`Invalid BOB address format: ${values["BOB Address"]}`);
    }

    const quoteParams: GatewayQuoteParams = {
      fromToken: "BTC",
      fromChain: "Bitcoin",
      fromUserAddress: fromBtcAddress,
      toChain: "bob-sepolia",
      toUserAddress: values["BOB Address"],
      toToken: "tBTC",
      amount: satsAmount,
      gasRefill: 10000,
    };

    // Log final params
    console.log("Final quote parameters:", quoteParams);
    return quoteParams;
  }

  async executePath(
    blocks: BlockType[],
    values: Record<string, Record<string, string>>,
    fromBtcAddress: string
  ): Promise<ExecutionResult> {
    try {
      const firstBlockValues = values[`chain-0`] || {};
      console.log("Starting execution with values:", {
        firstBlockValues,
        fromBtcAddress,
      });

      // 1. Get tokens and validate
      let tokens;
      try {
        tokens = await sdk.getTokens();
        console.log("Available tokens:", tokens);
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
        throw new Error("Unable to fetch available tokens. Please try again.");
      }

      const tbtcToken = tokens.find((t) => t.symbol === "tBTC");
      if (!tbtcToken) {
        throw new Error("tBTC token not found in available tokens list");
      }

      // 2. Create quote parameters
      let quoteParams;
      try {
        quoteParams = await this.createQuoteParams(
          firstBlockValues,
          fromBtcAddress
        );
      } catch (error) {
        console.error("Failed to create quote parameters:", error);
        throw error;
      }

      // 3. Get quote with validation
      let quote;
      try {
        quote = await sdk.getQuote(quoteParams);
        console.log("Quote received:", quote);

        // Validate quote response
        if (!quote.satoshis || quote.satoshis <= 0) {
          throw new Error(
            `Invalid satoshis amount in quote: ${quote.satoshis}`
          );
        }
        if (!quote.bitcoinAddress) {
          throw new Error("Missing bitcoin address in quote");
        }
      } catch (error) {
        console.error("Failed to get quote:", error);
        throw new Error("Failed to get quote from gateway. Please try again.");
      }

      // 4. Start order with detailed error handling
      let orderDetails;
      try {
        console.log("Starting order with:", {
          quote,
          quoteParams,
        });

        orderDetails = await sdk.startOrder(quote, quoteParams);
        console.log("Order started:", orderDetails);

        if (!orderDetails.uuid || !orderDetails.psbtBase64) {
          throw new Error("Incomplete order details received");
        }
      } catch (error) {
        console.error("Failed to start order:", error);
        if (error instanceof Error && error.message.includes("500")) {
          throw new Error(
            "Gateway service error. Please try again in a few minutes."
          );
        }
        throw new Error("Failed to start order. Please try again.");
      }

      return {
        success: true,
        details: {
          uuid: orderDetails.uuid,
          psbtBase64: orderDetails.psbtBase64,
          quote,
          targetToken: "tBTC",
        },
      };
    } catch (error) {
      console.error("BOB Gateway error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }
}

export function useBobGateway() {
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

      const result = await service.executePath(blocks, values, btcAddress);

      if (!result.success || !result.details) {
        throw new Error(result.error || "Failed to prepare transaction");
      }

      const txResponse = await sendGatewayTransaction({
        toToken: "tBTC",
        evmAddress: values[`chain-0`]?.["BOB Address"] || "",
        value: BigInt(result.details.quote?.satoshis || 0),
      });

      if (typeof txResponse === "string") {
        return { success: true, txHash: txResponse };
      } else {
        throw new Error("Invalid transaction response format");
      }
    } catch (error) {
      console.error("Execution error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    executePath,
    isExecuting,
  };
}
