"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeFailSchema = exports.executeSuccessSchema = exports.precheckFailSchema = exports.precheckSuccessSchema = exports.toolParamsSchema = void 0;
const zod_1 = require("zod");
/**
 * Tool Parameters Schema
 * Defines the input parameters for setting oracle price
 */
exports.toolParamsSchema = zod_1.z.object({
    newPrice: zod_1.z.string().regex(/^\d+$/, "Price must be a positive integer string"),
    oracleAddress: zod_1.z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid oracle contract address"),
    rpcUrl: zod_1.z.string().url("Invalid RPC URL"),
    chainId: zod_1.z.number().positive("Chain ID must be positive"),
});
/**
 * Precheck Success Schema
 */
exports.precheckSuccessSchema = zod_1.z.object({
    message: zod_1.z.string(),
    estimatedGas: zod_1.z.string().optional(),
});
/**
 * Precheck Fail Schema
 */
exports.precheckFailSchema = zod_1.z.object({
    reason: zod_1.z.string(),
    details: zod_1.z.string().optional(),
});
/**
 * Execute Success Schema
 */
exports.executeSuccessSchema = zod_1.z.object({
    txHash: zod_1.z.string(),
    newPrice: zod_1.z.string(),
    message: zod_1.z.string(),
});
/**
 * Execute Fail Schema
 */
exports.executeFailSchema = zod_1.z.object({
    reason: zod_1.z.string(),
    error: zod_1.z.string().optional(),
});
