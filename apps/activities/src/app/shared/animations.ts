import { trigger, transition, animate, style } from '@angular/animations';

export const slideInOutAnimation =[
  trigger('slideInOut', [
    transition(':enter', [
      style({opacity: 0}),
      animate('150ms ease-in', style({opacity: 1}))
    ]),
    transition(':leave', [
      animate('200ms ease-out', style({transform: 'translateY(-5%)'}))
    ])
  ])
];
export const fadeInOutAnimation =[
  trigger('fadeInOut', [
    transition(':enter', [
      style({opacity: 0}),
      animate('150ms ease-in', style({opacity: 1}))
    ]),
    transition(':leave', [
      animate('150ms ease-in', style({opacity: 0}))
    ])
  ])
];
