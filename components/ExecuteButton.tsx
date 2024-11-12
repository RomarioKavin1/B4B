import React from "react";
import { Play, Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useBobGateway } from "@/services/bobGateway";
import { useGlittr } from "@/services/glittr";
import { useAccount } from "@gobob/sats-wagmi";
import { cn } from "@/lib/utils";

const ExecuteButton: React.FC<{
  blocks: BlockType[];
  values: Record<string, Record<string, string>>;
}> = ({ blocks, values }) => {
  const bobGateway = useBobGateway();
  const glittrService = useGlittr();
  const { address: btcAddress } = useAccount();

  const getServiceType = (blocks: BlockType[]): "bob" | "glittr" => {
    const firstBlock = blocks[0];
    return firstBlock?.technology === "Glittr" ? "glittr" : "bob";
  };

  const isExecuting =
    getServiceType(blocks) === "glittr"
      ? glittrService.isExecuting
      : bobGateway.isExecuting;

  const handleExecute = async () => {
    if (!btcAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Bitcoin wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      const serviceType = getServiceType(blocks);
      console.log("Executing with service:", serviceType, "blocks:", blocks);

      let result;

      if (serviceType === "glittr") {
        result = await glittrService.executePath(blocks, values);
        if (result.success) {
          toast({
            title: "Contract Created!",
            description: (
              <div className="mt-2 space-y-2">
                <p>Your Glittr contract has been deployed successfully.</p>
                {result.txid && (
                  <p className="font-mono text-xs break-all">
                    Transaction ID: {result.txid}
                  </p>
                )}
              </div>
            ),
          });
        }
      } else {
        result = await bobGateway.executePath(blocks, values);
        if (result.success) {
          toast({
            title: "Transaction Submitted!",
            description: (
              <div className="mt-2 space-y-2">
                <p>Your transaction has been submitted to BOB Gateway.</p>
                {result.txHash && (
                  <p className="font-mono text-xs break-all">
                    Hash: {result.txHash}
                  </p>
                )}
              </div>
            ),
          });
        }
      }

      if (!result.success) {
        toast({
          title:
            serviceType === "glittr"
              ? "Contract Creation Failed"
              : "Transaction Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Execution error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getButtonText = () => {
    if (!btcAddress) {
      return (
        <>
          <Wallet size={20} />
          Connect Wallet
        </>
      );
    }

    if (isExecuting) {
      return (
        <>
          <Loader2 size={20} className="animate-spin" />
          {getServiceType(blocks) === "glittr"
            ? "Deploying..."
            : "Processing..."}
        </>
      );
    }

    const serviceType = getServiceType(blocks);
    return (
      <>
        <Play size={20} />
        {serviceType === "glittr" ? "Deploy Contract" : "Execute Flow"}
      </>
    );
  };

  return (
    <Button
      size="lg"
      onClick={handleExecute}
      disabled={isExecuting || !btcAddress}
      className={cn(
        "bg-black text-white border-2 border-black rounded-xl",
        "shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
        "hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]",
        "hover:translate-y-[-2px]",
        "transition-all duration-200",
        "flex items-center gap-2",
        (!btcAddress || isExecuting) && "opacity-50 cursor-not-allowed"
      )}
    >
      {getButtonText()}
    </Button>
  );
};

export default ExecuteButton;
