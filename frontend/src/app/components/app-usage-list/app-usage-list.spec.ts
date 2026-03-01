import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUsageList } from './app-usage-list';

describe('AppUsageList', () => {
  let component: AppUsageList;
  let fixture: ComponentFixture<AppUsageList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppUsageList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppUsageList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
