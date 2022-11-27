import { Injectable } from "@angular/core";
import { Observable, Subscription, fromEvent } from "rxjs";
@Injectable()
export class ConnectivityService {
  offlineEvent?: Observable<Event>;
  onlineEvent?: Observable<Event>;
  subscriptions: Subscription[] = [];

  constructor() {
    this.handleAppConnectivityChanges();
  }

  private handleAppConnectivityChanges(): void {
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this.subscriptions.push(this.onlineEvent.subscribe(e => {
      // handle online mode
      console.log('Online...');
    }));

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      // handle offline mode
      console.log('Offline...');
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
