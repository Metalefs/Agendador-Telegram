import { Injectable } from "@angular/core";
import { Observable, Subscription, fromEvent, Subject } from "rxjs";
@Injectable()
export class ConnectivityService {
  offlineEvent?: Observable<Event>;
  onlineEvent?: Observable<Event>;
  subscriptions: Subscription[] = [];

  status: Subject<any> = new Subject()

  constructor() {
    this.handleAppConnectivityChanges();
  }

  private handleAppConnectivityChanges(): void {
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this.subscriptions.push(this.onlineEvent.subscribe(e => {
      // handle online mode
      console.log('Online...');
      this.status.next(true);
    }));

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      // handle offline mode
      console.log('Offline...');
      this.status.next(false);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
