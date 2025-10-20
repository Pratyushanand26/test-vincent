"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockOracleSetterTool = void 0;
const vincent_tool_sdk_1 = require("@lit-protocol/vincent-tool-sdk");
const la_utils_1 = require("@lit-protocol/vincent-scaffold-sdk/la-utils");
const ethers_1 = require("ethers");
const schemas_1 = require("./schemas");
const index_1 = require("./helpers/index");
exports.mockOracleSetterTool = (0, vincent_tool_sdk_1.createVincentTool)({
    packageName: "@agentic-ai/vincent-tool-mock-oracle-setter",
    toolParamsSchema: schemas_1.toolParamsSchema,
    precheckSuccessSchema: schemas_1.precheckSuccessSchema,
    precheckFailSchema: schemas_1.precheckFailSchema,
    executeSuccessSchema: schemas_1.executeSuccessSchema,
    executeFailSchema: schemas_1.executeFailSchema,
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
    precheck: async ({ toolParams }, { succeed, fail }) => {
        const { newPrice, oracleAddress, rpcUrl, chainId } = toolParams;
        // Validate oracle address
        if (!(0, index_1.isValidAddress)(oracleAddress)) {
            return fail({
                reason: "Invalid oracle contract address format",
                details: `Address: ${oracleAddress}`,
            });
        }
        // Validate price
        if (!(0, index_1.isValidPrice)(newPrice)) {
            return fail({
                reason: "Invalid price format",
                details: "Price must be a positive integer string",
            });
        }
        // Validate RPC URL
        try {
            new URL(rpcUrl);
        }
        catch {
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
            message: `Validation passed. Ready to set oracle price to ${(0, index_1.formatPrice)(newPrice)}`,
            estimatedGas: "~50000",
        });
    },
    /**
     * Execute Phase
     * Runs inside Lit Actions to perform the actual contract interaction
     */
    execute: async ({ toolParams }, { succeed, fail, delegation, policiesContext }) => {
        const { newPrice, oracleAddress, rpcUrl, chainId } = toolParams;
        try {
            console.log("[@agentic-ai/vincent-tool-mock-oracle-setter/execute] 🚀 Executing Mock Oracle Setter Tool", {
                newPrice,
                oracleAddress,
                rpcUrl,
                chainId,
            });
            // Get provider - configurable by user via rpcUrl and chainId parameters
            const provider = new ethers_1.ethers.JsonRpcProvider(rpcUrl, chainId);
            console.log("[@agentic-ai/vincent-tool-mock-oracle-setter/execute] 🔗 Using RPC URL:", rpcUrl);
            console.log("[@agentic-ai/vincent-tool-mock-oracle-setter/execute] ⛓️ Using Chain ID:", chainId);
            // Get PKP public key from delegation context
            const pkpPublicKey = delegation.delegatorPkpInfo.publicKey;
            if (!pkpPublicKey) {
                return fail({
                    reason: "[@agentic-ai/vincent-tool-mock-oracle-setter/execute] ❌ PKP public key not available from delegation context",
                });
            }
            // Get the PKP address to use as callerAddress
            const callerAddress = la_utils_1.laUtils.helpers.toEthAddress(pkpPublicKey);
            console.log("[@agentic-ai/vincent-tool-mock-oracle-setter/execute] 🔑 PKP wallet address:", callerAddress);
            // Prepare contract call data
            const contractCallData = {
                provider,
                pkpPublicKey,
                callerAddress,
                contractAddress: oracleAddress,
                abi: index_1.MOCK_ORACLE_ABI,
                functionName: "setPrice",
                args: [newPrice],
                chainId,
            };
            console.log("[@agentic-ai/vincent-tool-mock-oracle-setter/execute] 📋 Contract call parameters:", {
                contractAddress: oracleAddress,
                functionName: "setPrice",
                args: [newPrice],
                callerAddress,
                chainId,
            });
            console.log("[@agentic-ai/vincent-tool-mock-oracle-setter/execute] 🚀 Attempting contract call...");
            // Execute the contract call using laUtils
            const txHash = await la_utils_1.laUtils.transaction.handler.contractCall(contractCallData);
            console.log("[@agentic-ai/vincent-tool-mock-oracle-setter/execute] ✅ Contract call completed, txHash:", txHash);
            console.log("[@agentic-ai/vincent-tool-mock-oracle-setter/execute] ✅ Mock oracle price set successfully", {
                txHash,
                newPrice,
                oracleAddress,
            });
            return succeed({
                txHash: txHash,
                newPrice: newPrice,
                message: `Successfully set oracle price to ${(0, index_1.formatPrice)(newPrice)}`,
            });
        }
        catch (error) {
            return fail({
                reason: "Failed to execute setPrice transaction",
                error: error?.message || String(error),
            });
        }
    },
});
