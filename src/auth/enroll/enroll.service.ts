import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Contract, Wallet, Wallets } from 'fabric-network';
import * as FabricCAServices from 'fabric-ca-client';

import * as ccp from '../../../assets/connection-config.json';
import { getContract } from '../../utils/gateway';

@Injectable()
export class EnrollService {
  public wallet: Wallet;
  private caClient: FabricCAServices;

  private mspID = 'Org1MSP';
  private caHostName = 'ca.org1.example.com';

  async onModuleInit() {
    this.caClient = EnrollService.buildCAClient(ccp, this.caHostName);
    this.wallet = await EnrollService.buildWallet();
  }

  public async enrollUser(username: string, password: string): Promise<{ role: string }> {
    console.log('enrollUser ', username, password);
    try {
      const enrollment = await this.caClient.enroll({
        enrollmentID: username,
        enrollmentSecret: password,
        attr_reqs: [
          { name: 'hf.EnrollmentID', optional: false },
          { name: 'role', optional: false },
        ],
      });
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: this.mspID,
        type: 'X.509',
      };

      const temporaryWallet: Wallet = await EnrollService.buildWallet();
      await temporaryWallet.put(username, x509Identity);
      const contract: Contract = await getContract(username, 'IdentityContract', temporaryWallet);
      const role = await contract.evaluateTransaction('GetRole');
      console.log('role', role, role.toString());
      await this.wallet.put(username, x509Identity);
      return { role: role.toString() };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  public async isUserEnrolled(username: string): Promise<boolean> {
    console.log('isUserEnrolled', !!(await this.wallet.get(username)));

    return !!(await this.wallet.get(username));
  }

  private static async buildWallet(): Promise<Wallet> {
    const newWallet: Wallet = await Wallets.newInMemoryWallet();
    console.log('Built an in memory wallet');
    return newWallet;
  }

  private static buildCAClient(ccp: Record<string, any>, caHostName: string): FabricCAServices {
    const caInfo = ccp.certificateAuthorities[caHostName]; // lookup CA details from config
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

    console.log(`Built a CA Client named ${caInfo.caName}`);
    return caClient;
  }
}
