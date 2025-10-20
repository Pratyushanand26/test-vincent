import {createVincentTool} from "@lit-protocol/vincent-tool-sdk";
import { laUtils } from "@lit-protocol/vincent-scaffold-sdk/la-utils";
import { ethers } from "ethers";


import {
  toolParamsSchema,
  precheckSuccessSchema,
  precheckFailSchema,
  executeSuccessSchema,
  executeFailSchema,
  type ToolParams,
} from "./schemas";

import {
  MOCK_ORACLE_ABI,
  isValidAddress,
  isValidPrice,
  formatPrice,
} from "./helpers/index";

export const mockOracleSetterTool = createVincentTool({
  packageName: "@agentic-ai/vincent-tool-mock-oracle-setter" as const,
  toolParamsSchema,
  precheckSuccessSchema,
  precheckFailSchema,
  executeSuccessSchema,
  executeFailSchema,
supportedPolicies: {
      policyByPackageName: new Map(),
    policyByIpfsCid: new Map(),
    cidToPackageName: new Map(),
    packageNameToCid: new Map(),
  },

  /**
   * Precheck Phase
   * Runs outside Lit Actions to validate parameters before execution
   */
  precheck: async (
    { toolParams },
    { succeed, fail }
  ) => {
    const { newPrice, oracleAddress, rpcUrl, chainId } = toolParams;

    // Validate oracle address
    if (!isValidAddress(oracleAddress)) {
      return fail({
        reason: "Invalid oracle contract address format",
        details: `Address: ${oracleAddress}`,
      });
    }

    // Validate price
    if (!isValidPrice(newPrice)) {
      return fail({
        reason: "Invalid price format",
        details: "Price must be a positive integer string",
      });
    }

    // Validate RPC URL
    try {
      new URL(rpcUrl);
    } catch {
      return fail({
        reason: "Invalid RPC URL format",
        details: rpcUrl,
      });
    }

    // Validate chain ID
    if (chainId <= 0) {
      return fail({
        reason: "Invalid chain ID",
        details: `Chain ID must be positive, got: ${chainId}`,
      });
    }

    return succeed({
      message: `Validation passed. Ready to set oracle price to ${formatPrice(newPrice)}`,
      estimatedGas: "~50000",
    });
  },

  /**
   * Execute Phase
   * Runs inside Lit Actions to perform the actual contract interaction
   */
  execute: async (
    { toolParams },
    { succeed, fail, delegation, policiesContext }
  ) => {
    const { newPrice, oracleAddress, rpcUrl, chainId } = toolParams;

    try {
      console.log(
        "[@agentic-ai/vincent-tool-mock-oracle-setter/execute] 🚀 Executing Mock Oracle Setter Tool",
        {
          newPrice,
          oracleAddress,
          rpcUrl,
          chainId,
        }
      );

      // Get provider - configurable by user via rpcUrl and chainId parameters
      const provider = new ethers.JsonRpcProvider(rpcUrl, chainId);

      console.log(
        "[@agentic-ai/vincent-tool-mock-oracle-setter/execute] 🔗 Using RPC URL:",
        rpcUrl
      );
      console.log(
        "[@agentic-ai/vincent-tool-mock-oracle-setter/execute] ⛓️ Using Chain ID:",
        chainId
      );

      // Get PKP public key from delegation context
      const pkpPublicKey = delegation.delegatorPkpInfo.publicKey;
      if (!pkpPublicKey) {
        return fail({
          reason:
            "[@agentic-ai/vincent-tool-mock-oracle-setter/execute] ❌ PKP public key not available from delegation context",
        });
      }

      // Get the PKP address to use as callerAddress
      const callerAddress = laUtils.helpers.toEthAddress(pkpPublicKey);

      console.log(
        "[@agentic-ai/vincent-tool-mock-oracle-setter/execute] 🔑 PKP wallet address:",
        callerAddress
      );

      // Prepare contract call data
      const contractCallData = {
        provider,
        pkpPublicKey,
        callerAddress,
        contractAddress: oracleAddress,
        abi: MOCK_ORACLE_ABI,
        functionName: "setPrice",
        args: [newPrice],
        chainId,
      };

      console.log(
        "[@agentic-ai/vincent-tool-mock-oracle-setter/execute] 📋 Contract call parameters:",
        {
          contractAddress: oracleAddress,
          functionName: "setPrice",
          args: [newPrice],
          callerAddress,
          chainId,
        }
      );

      console.log(
        "[@agentic-ai/vincent-tool-mock-oracle-setter/execute] 🚀 Attempting contract call..."
      );

      // Execute the contract call using laUtils
      const txHash = await laUtils.transaction.handler.contractCall(
        contractCallData
      );

      console.log(
        "[@agentic-ai/vincent-tool-mock-oracle-setter/execute] ✅ Contract call completed, txHash:",
        txHash
      );

      console.log(
        "[@agentic-ai/vincent-tool-mock-oracle-setter/execute] ✅ Mock oracle price set successfully",
        {
          txHash,
          newPrice,
          oracleAddress,
        }
      );

      return succeed({
        txHash: txHash,
        newPrice: newPrice,
        message: `Successfully set oracle price to ${formatPrice(newPrice)}`,
      });
    } catch (error: any) {
      return fail({
        reason: "Failed to execute setPrice transaction",
        error: error?.message || String(error),
      });
    }
  },
});