"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOCK_ORACLE_ABI = void 0;
exports.isValidAddress = isValidAddress;
exports.isValidPrice = isValidPrice;
exports.formatPrice = formatPrice;
const ethers_1 = require("ethers");
/**
 * MockOracle ABI - only the setPrice function
 */
exports.MOCK_ORACLE_ABI = [
    "function setPrice(uint256 _newPrice) external",
];
/**
 * Validate Ethereum address format
 */
function isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}
/**
 * Validate price format (should be numeric string)
 */
function isValidPrice(price) {
    return /^\d+$/.test(price) && BigInt(price) > 0n;
}
/**
 * Format price for display
 */
function formatPrice(price) {
    try {
        return ethers_1.ethers.formatUnits(price, 18);
    }
    catch {
        return price;
    }
}
