"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Transaction = {
  from: string;
  to: string;
  total: number;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  const connect = () => {
    if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
      console.log("Already connected ✅");
      return;
    }
  
    ws.current = new WebSocket("wss://ws.blockchain.info/inv");
  
    ws.current.onopen = () => {
      console.log("WebSocket connected ✅");
      setIsConnected(true);
      ws.current?.send(JSON.stringify({ op: "unconfirmed_sub" }));
    };
  
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
  
      if (data.op === "utx") {
        const inputs = data.x.inputs;
        const outputs = data.x.out;
  
        const from = inputs[0]?.prev_out?.addr || "Unknown";
        const to = outputs[0]?.addr || "Unknown";
        const sumBTC =
          outputs.reduce((sum: number, output: { value: number }) => sum + output.value, 0) / 1e8;
  
        setTransactions((prev) => [
          { from, to, total: sumBTC },
          ...prev.slice(0, 19),
        ]);
      }
    };
  
    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    ws.current.onclose = (event) => {
      console.log("WebSocket disconnected ❌", event.reason || "");
      setIsConnected(false);
      ws.current = null;
    };
  };
  
  const disconnect = () => {
    if (ws.current) {
      if (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING) {
        ws.current.close(1000, "Client closing connection");
      }
      ws.current = null;
    }
    setIsConnected(false);
  };
  
  const reset = () => {
    disconnect();
    setTransactions([]);
  };

  useEffect(() => {
    if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
      connect(); 
    }
  
    return () => {
      if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
        ws.current.close();
      }
    };
  }, []);
  

  const totalSum = transactions.reduce((sum, tx) => sum + tx.total, 0);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col">
      <div className="px-6 py-4 bg-slate-800 text-white flex justify-between items-center shadow-md">
        <Link
          href="/"
          className="text-lg font-medium hover:text-purple-300 transition"
        >
          ← Back to Home
        </Link>
        <div className="flex gap-4">
          <button
            onClick={connect}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md disabled:opacity-50"
            disabled={isConnected}
          >
            Start
          </button>
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md disabled:opacity-50"
            disabled={!isConnected}
          >
            Stop
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded-md"
          >
            Reset
          </button>
        </div>
      </div>

      <main className="flex flex-col items-center flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          📈 Bitcoin Transactions Tracker
        </h1>

        <div className="mb-6 text-xl font-semibold text-gray-700">
          Total: {totalSum.toFixed(6)} BTC
        </div>

        <div className="w-full max-w-6xl overflow-x-auto rounded-lg shadow bg-white">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-4 font-bold">From</th>
                <th className="p-4 font-bold">To</th>
                <th className="p-4 font-bold text-right">Sum</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr
                  key={`${index}-${tx.from}-${tx.to}-${tx.total}`}
                  className="border-t animate-fade-in hover:bg-gray-50"
                >
                  <td className="p-4 text-gray-500 font-medium text-sm truncate max-w-[200px]">
                    {tx.from}
                  </td>
                  <td className="p-4 text-gray-500 font-medium text-sm truncate max-w-[200px]">
                    {tx.to}
                  </td>
                  <td className="p-4 text-gray-500 font-semibold text-right">
                    {tx.total.toFixed(6)} BTC
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
