import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import Web3 from 'web3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  contract: string = "";
  sender: string = "";

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['contract']) {
        this.contract = params['contract'];
      }
      if (params['sender']) {
        this.sender = params['sender'];
      }
    });
  }

  isAddress(address: string): boolean {
    return Web3.utils.isAddress(address);
  }

  updateQueryParams(): void {
    const sender = this.sender;
    const contract = this.contract;
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {contract, sender},
        queryParamsHandling: 'merge'
      });
  }
}
