import { z } from "zod";

/**
 * Tool Parameters Schema
 * Defines the input parameters for setting oracle price
 */
export const toolParamsSchema = z.object({
  newPrice: z.string().regex(/^\d+$/, "Price must be a positive integer string"),
  oracleAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid oracle contract address"),
  rpcUrl: z.string().url("Invalid RPC URL"),
  chainId: z.number().positive("Chain ID must be positive"),
});

export type ToolParams = z.infer<typeof toolParamsSchema>;

/**
 * Precheck Success Schema
 */
export const precheckSuccessSchema = z.object({
  message: z.string(),
  estimatedGas: z.string().optional(),
});

export type PrecheckSuccess = z.infer<typeof precheckSuccessSchema>;

/**
 * Precheck Fail Schema
 */
export const precheckFailSchema = z.object({
  reason: z.string(),
  details: z.string().optional(),
});

export type PrecheckFail = z.infer<typeof precheckFailSchema>;

/**
 * Execute Success Schema
 */
export const executeSuccessSchema = z.object({
  txHash: z.string(),
  newPrice: z.string(),
  message: z.string(),
});

export type ExecuteSuccess = z.infer<typeof executeSuccessSchema>;

/**
 * Execute Fail Schema
 */
export const executeFailSchema = z.object({
  reason: z.string(),
  error: z.string().optional(),
});

export type ExecuteFail = z.infer<typeof executeFailSchema>;