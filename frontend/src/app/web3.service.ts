import {Injectable} from '@angular/core';
import Web3 from "web3";

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  web3 = new Web3('ws://localhost:8546');

  constructor() {
    (window as any).web3 = this.web3;
  }
}
