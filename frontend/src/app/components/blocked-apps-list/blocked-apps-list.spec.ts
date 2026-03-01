import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockedAppsList } from './blocked-apps-list';

describe('BlockedAppsList', () => {
  let component: BlockedAppsList;
  let fixture: ComponentFixture<BlockedAppsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockedAppsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockedAppsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
