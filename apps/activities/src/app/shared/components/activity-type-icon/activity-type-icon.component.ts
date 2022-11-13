import { Component, Input, OnInit } from '@angular/core';
import { ActivityTypeEnum, IconTypeEnum } from '@uncool/shared';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-activity-type-icon',
  templateUrl: './activity-type-icon.component.html'
})
export class ActivityTypeIconComponent implements OnInit {
  @Input() type!:ActivityTypeEnum;
  activityMap!:any;
  iconTypes = IconTypeEnum;

  constructor(private service: DataService) { }

  ngOnInit() {
    this.activityMap = this.getActivityIconMap();
  }

  getActivityIconMap(){
    return this.service.activityTypesMap.find(t=>t.name===this.type);
  }

}
