import { useConnect, useAccount, useDisconnect } from "@gobob/sats-wagmi";
import { Wallet, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";

const WalletConnector: React.FC = () => {
  const { connectors, connect, isSuccess, error } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      {!isSuccess ? (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="
                px-6 py-3 
                bg-gradient-to-r from-indigo-500/90 to-purple-500/90
                hover:from-indigo-500 hover:to-purple-500
                backdrop-blur-sm
                rounded-xl
                text-white
                font-semibold
                shadow-lg
                border border-white/10
                flex items-center gap-2
                transition-all duration-300
                hover:shadow-xl
                hover:scale-105
              "
          >
            <Wallet size={20} />
            Connect Wallet
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Connector Options Dropdown */}
          {isOpen && (
            <div
              className="
                absolute top-full mt-2 right-0
                bg-white/90 backdrop-blur-sm
                rounded-xl shadow-xl
                border border-white/20
                overflow-hidden
                w-48
                animate-in fade-in slide-in-from-top-5
              "
            >
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => {
                    connect({ connector });
                    setIsOpen(false);
                  }}
                  className="
                      w-full px-4 py-3
                      text-gray-700 text-sm
                      hover:bg-purple-500/10
                      flex items-center gap-2
                      transition-colors
                      border-b border-gray-100/50
                      last:border-0
                    "
                >
                  <img
                    src={`/wallets/${connector.name}.png`}
                    alt={connector.name}
                    className="w-5 h-5"
                  />
                  {connector.name.split(" ")[0]}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {/* Connected State */}
          <div
            className="
              px-4 py-2
              bg-green-500/90 backdrop-blur-sm
              rounded-xl
              text-white
             font-extrabold
              text-sm
              border border-white/10
              shadow-lg
            "
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
            </div>
          </div>

          {/* Disconnect Button */}
          <button
            onClick={() => disconnect()}
            className="
                p-2
                bg-red-500/90 backdrop-blur-sm
                rounded-xl
                text-white
                shadow-lg
                border border-white/10
                hover:bg-red-500
                transition-colors
              "
          >
            <LogOut size={18} />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="
            absolute top-full mt-2 right-0
            px-4 py-2
            bg-red-500/90 backdrop-blur-sm
            rounded-xl
            text-white text-sm
            shadow-lg
            border border-white/10
            animate-in fade-in slide-in-from-top-5
          "
        >
          {error.message}
        </div>
      )}
    </div>
  );
};
export default WalletConnector;
