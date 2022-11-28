import { Component, Input, OnInit } from '@angular/core';
import { ActivityTypeEnum, IconTypeEnum } from '@uncool/shared';
import { ActivitiesService } from '../../services/activities.service';

@Component({
  selector: 'app-activity-type-icon',
  templateUrl: './activity-type-icon.component.html',
  styleUrls: ['./activity-type-icon.component.scss']
})
export class ActivityTypeIconComponent implements OnInit {
  @Input() type!:ActivityTypeEnum;
  @Input() showLabel = false;
  activityMap!:any;
  iconTypes = IconTypeEnum;

  constructor(private service: ActivitiesService) { }

  ngOnInit() {
    this.activityMap = this.getActivityIconMap();
  }

  getActivityIconMap(){
    return this.service.activityTypesMap.find(t=>t.name===this.type);
  }

}
