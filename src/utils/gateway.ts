import { Contract, Gateway, GatewayOptions, Wallet } from 'fabric-network';
import * as ccp from '../../assets/connection-config.json';

const channelName = 'mychannel';
const chaincodeName = 'grade-book';

export async function getContract(username: string, contractName: string, wallet: Wallet): Promise<Contract> {
  const gateway = new Gateway();

  const gatewayOpts: GatewayOptions = {
    wallet,
    identity: username,
    discovery: { enabled: true, asLocalhost: true },
  };

  try {
    await gateway.connect(ccp, gatewayOpts);
    const network = await gateway.getNetwork(channelName);
    return network.getContract(chaincodeName, contractName);
  } catch (error) {
    console.log('ERROR: ', error.message);
    return;
  }
}
