import {Pipe, PipeTransform} from '@angular/core';
import Web3 from 'web3';

@Pipe({name: 'bytes'})
export class BytesPipe implements PipeTransform {
  transform(hex: string, to?: string): number[] | string {
    if (to === "utf8") {
      return Web3.utils.hexToUtf8(hex);
    }
    return Web3.utils.hexToBytes(hex);
  }
}
