"use client";
import {
  useConnect,
  SatsConnector,
  useAccount,
  useDisconnect,
} from "@gobob/sats-wagmi";
import { useEffect } from "react";

export default function Home() {
  const { connectors, connect, isSuccess, error } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  useEffect(() => {
    console.log({ isSuccess, error });
  }, [error, isSuccess]);
  return (
    <div>
      {connectors.map((connector) => (
        <div key={connector.id}>
          <button key={connector.name} onClick={() => connect({ connector })}>
            {connector.name}
          </button>
        </div>
      ))}
      {isSuccess && (
        <div>
          <p>Address: {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
