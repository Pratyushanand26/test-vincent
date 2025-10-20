//@ts-ignore
import { getVincentToolClient } from '@lit-protocol/vincent-app-sdk';
//@ts-ignore
import { bundledVincentTool as mockOracleSetterTool } from '../../../vincent-abilities/mock-oracle-setter/dist/index.js';
import { ethers } from 'ethers';
import { env } from '../../../env';

const { SEPOLIA_RPC_URL, VINCENT_DELEGATEE_PRIVATE_KEY } = env;

export async function executeDCASwap(job: any) {
  try {
    const { pkpInfo, app } = job.attrs.data;

    // Create Vincent tool client
    const provider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);
    const signer = new ethers.Wallet(VINCENT_DELEGATEE_PRIVATE_KEY, provider);

    const oracleToolClient = getVincentToolClient({
      bundledVincentTool: mockOracleSetterTool,
      ethersSigner: signer,
    });

    // Prepare parameters
    const toolParams = {
      newPrice: ethers.utils.parseUnits('123', 18).toString(),
      oracleAddress: '0xF7B504A8BC235E4BC3f38D452A57798492bc7ae7',
      rpcUrl: SEPOLIA_RPC_URL,
      chainId: 11155111, // Sepolia
    };

    // Run precheck
    const precheckResult = await oracleToolClient.precheck(toolParams, {
      delegatorPkpEthAddress: pkpInfo.ethAddress,
    });

    if (!precheckResult.success) {
      throw new Error(`Precheck failed: ${JSON.stringify(precheckResult)}`);
    }

    // Execute the transaction
    const executeResult = await oracleToolClient.execute(toolParams, {
      delegatorPkpEthAddress: pkpInfo.ethAddress,
    });

    if (!executeResult.success) {
      throw new Error(`Execute failed: ${JSON.stringify(executeResult)}`);
    }

    console.log('✅ Oracle price updated:', executeResult.result?.txHash);
    return executeResult;

  } catch (error) {
    console.error('❌ Failed to execute DCA swap:', error);
    throw error;
  }
}