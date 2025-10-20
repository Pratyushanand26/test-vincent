# Mock Oracle Setter Tool

A Vincent ability for setting prices on a MockOracle smart contract.

## Parameters

- `newPrice`: Price value as a string (in wei, 18 decimals)
- `oracleAddress`: Address of the MockOracle contract
- `rpcUrl`: RPC endpoint URL
- `chainId`: Network chain ID (e.g., 11155111 for Sepolia)

## Usage Example

\`\`\`typescript
const params = {
  newPrice: "123000000000000000000", // 123 * 10^18
  oracleAddress: "0xF7B504A8BC235E4BC3f38D452A57798492bc7ae7",
  rpcUrl: "https://sepolia.infura.io/v3/YOUR-KEY",
  chainId: 11155111
};
\`\`\`