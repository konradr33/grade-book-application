import { Contract } from 'fabric-network';
import { HttpException, HttpStatus } from '@nestjs/common';

export async function evaluateTransaction<T>(contract: Contract, name: string, ...args: string[]): Promise<T> {
  try {
    const result = await contract.evaluateTransaction(name, ...args);
    return JSON.parse(result.toString());
  } catch (error) {
    console.error(error.message);
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
}

export async function submitTransaction<T>(contract: Contract, name: string, ...args: string[]): Promise<T> {
  try {
    const result = await contract.submitTransaction(name, ...args);
    return JSON.parse(result.toString());
  } catch (error) {
    console.error(error.message);
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
}
