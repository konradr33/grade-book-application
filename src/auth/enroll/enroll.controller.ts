import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';

import * as ccp from '../../../assets/connection-config.json';
import { Wallet, Wallets } from 'fabric-network';
import * as FabricCAServices from 'fabric-ca-client';

@Controller('enroll')
export class EnrollController {
  private wallet: Wallet;
  private caClient: FabricCAServices;

  async onModuleInit() {
    console.log('onModuleInit()');
    this.caClient = buildCAClient(ccp, 'ca.org1.example.com');

    this.wallet = await buildWallet();
  }

  @Get()
  public async enrollUser(@Query('login') login: string, @Query('password') password: string) {
    console.log('enrollUser ', login, password);

    try {
      await enrollUser(this.caClient, this.wallet, 'Org1MSP', login, password, 'org1.department1');
    } catch (e) {
      console.log(e.errors);
      throw new HttpException(e.errors[0]?.message, HttpStatus.UNAUTHORIZED);
    }
  }
}

const buildWallet = async (): Promise<Wallet> => {
  // Create a new  wallet : Note that wallet is for managing identities.
  let wallet: Wallet;
  wallet = await Wallets.newInMemoryWallet();
  console.log('Built an in memory wallet');

  return wallet;
};

const buildCAClient = (ccp: Record<string, any>, caHostName: string): FabricCAServices => {
  // Create a new CA client for interacting with the CA.
  const caInfo = ccp.certificateAuthorities[caHostName]; // lookup CA details from config
  const caTLSCACerts = caInfo.tlsCACerts.pem;
  const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

  console.log(`Built a CA Client named ${caInfo.caName}`);
  return caClient;
};

const enrollUser = async (
  caClient: FabricCAServices,
  wallet: Wallet,
  orgMspId: string,
  userId: string,
  secret: string,
  affiliation: string,
) => {
  const enrollment = await caClient.enroll({
    enrollmentID: userId,
    enrollmentSecret: secret,
  });
  const x509Identity = {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
    mspId: orgMspId,
    type: 'X.509',
  };
  await wallet.put(userId, x509Identity);
};
