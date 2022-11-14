import { Injectable } from '@angular/core';
function getWindow(): any {
  return window;
}
@Injectable({
  providedIn: 'root',
})
export class WindowRef {
  [x: string]: any;
  dataLayer: any;
  gtag: () => void;
  get nativeWindow(): Window {
    return getWindow();
  }
}
