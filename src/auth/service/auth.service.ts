import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Contract, Wallet, Wallets } from 'fabric-network';
import * as FabricCAServices from 'fabric-ca-client';
import { JwtService } from '@nestjs/jwt';

import * as ccp from '../../../assets/connection-config.json';
import { getContract } from '../../utils/gateway';

@Injectable()
export class AuthService {
  public wallet: Wallet;
  private caClient: FabricCAServices;

  private mspID = 'Org1MSP';
  private caHostName = 'ca.org1.example.com';

  constructor(private jwtService: JwtService) {}

  async onModuleInit() {
    this.caClient = AuthService.buildCAClient(ccp, this.caHostName);
    this.wallet = await AuthService.buildWallet();
  }

  public async login(username: string, password: string): Promise<{ token: string; role: string }> {
    const { role } = await this.enrollUser(username, password);
    const token = this.jwtService.sign({ username, role });
    return { role, token };
  }

  private async enrollUser(username: string, password: string): Promise<{ role: string }> {
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

      const temporaryWallet: Wallet = await AuthService.buildWallet();
      await temporaryWallet.put(username, x509Identity);
      const contract: Contract = await getContract(username, 'IdentityContract', temporaryWallet);
      const role = await contract.evaluateTransaction('GetRole');

      await this.wallet.put(username, x509Identity);
      return { role: role.toString() };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  public async isUserEnrolled(username: string): Promise<boolean> {
    return !!(await this.wallet.get(username));
  }

  private static async buildWallet(): Promise<Wallet> {
    return await Wallets.newInMemoryWallet();
  }

  private static buildCAClient(ccp: Record<string, any>, caHostName: string): FabricCAServices {
    const caInfo = ccp.certificateAuthorities[caHostName];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    return new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
  }
}
