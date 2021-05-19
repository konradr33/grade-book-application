import { Contract, Gateway, GatewayOptions, Wallet } from 'fabric-network';
import * as ccp from '../../assets/connection-config.json';
import { HttpException, HttpStatus } from '@nestjs/common';

const channelName = 'grade-book-channel';
const chaincodeName = 'grade-book';

export async function getContract(username: string, contractName: string, wallet: Wallet): Promise<Contract> {
  const gateway = new Gateway();

  const gatewayOpts: GatewayOptions = {
    wallet,
    identity: username,
    discovery: { enabled: true, asLocalhost: true },
  };
  let contract: Contract;
  try {
    await gateway.connect(ccp, gatewayOpts);
    const network = await gateway.getNetwork(channelName);
    contract = network.getContract(chaincodeName, contractName);
  } catch (error) {
    console.error('ERROR: ', error.message);
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }

  if (!contract) throw new HttpException('Could not get contract', HttpStatus.BAD_REQUEST);
  return contract;
}
