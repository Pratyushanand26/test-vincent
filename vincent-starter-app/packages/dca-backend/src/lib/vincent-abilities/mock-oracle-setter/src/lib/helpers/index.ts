import { ethers } from "ethers";

/**
 * MockOracle ABI - only the setPrice function
 */
export const MOCK_ORACLE_ABI = [
  "function setPrice(uint256 _newPrice) external",
];

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate price format (should be numeric string)
 */
export function isValidPrice(price: string): boolean {
  return /^\d+$/.test(price) && BigInt(price) > 0n;
}

/**
 * Format price for display
 */
export function formatPrice(price: string): string {
  try {
    return ethers.formatUnits(price, 18);
  } catch {
    return price;
  }
}
