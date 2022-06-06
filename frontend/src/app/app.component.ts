import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import Web3 from 'web3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  address: string = "";

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['address']) {
        this.address = params['address'];
      }
    });
  }

  isAddress(address: string): boolean {
    return Web3.utils.isAddress(address);
  }

  setAddress(address: string): void {
    this.address = address;
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {address},
        queryParamsHandling: 'merge'
      });
  }
}
