import {Component, Input, OnInit} from '@angular/core';
import {TrackerService} from "../tracker.service";
import Web3 from "web3";

@Component({
  selector: 'app-tracker-settings',
  templateUrl: './tracker-settings.component.html',
  styleUrls: ['./tracker-settings.component.css']
})
export class TrackerSettingsComponent implements OnInit {
  @Input() address!: string;
  paused: boolean = true;
  timeout: number = 0;
  interval: number = 0;

  constructor(private trackerService: TrackerService) {
  }

  ngOnInit(): void {
    this.getTimeout();
    this.getInterval();
    this.getPaused();
  }

  getTimeout(): void {
    this.trackerService.getTimeout().subscribe(
      timeout => this.timeout = timeout
    );
  }

  getInterval(): void {
    this.trackerService.getInterval().subscribe(
      interval => this.interval = interval
    );
  }

  getPaused(): void {
    this.trackerService.getPaused().subscribe(
      paused => this.paused = paused
    );
  }

  setInterval() {
    this.trackerService.setInterval(this.interval, this.address);
  }

  setTimeout() {
    this.trackerService.setTimeout(this.timeout, this.address);
  }

  setPaused(): void {
    this.trackerService.setPaused(this.paused, this.address);
  }

  isAddress(account: string): boolean {
    return Web3.utils.isAddress(account);
  }
}
