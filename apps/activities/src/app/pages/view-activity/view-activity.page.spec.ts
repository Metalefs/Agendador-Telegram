import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ViewActivityPage } from './view-activity.page';
import { VieActivityPageRoutingModule } from './view-activity-routing.module';


describe('ViewActivityPage', () => {
  let component: ViewActivityPage;
  let fixture: ComponentFixture<ViewActivityPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewActivityPage ],
      imports: [IonicModule.forRoot(), VieActivityPageRoutingModule, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
