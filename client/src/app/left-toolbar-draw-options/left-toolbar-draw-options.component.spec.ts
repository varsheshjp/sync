import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftToolbarDrawOptionsComponent } from './left-toolbar-draw-options.component';

describe('LeftToolbarDrawOptionsComponent', () => {
  let component: LeftToolbarDrawOptionsComponent;
  let fixture: ComponentFixture<LeftToolbarDrawOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftToolbarDrawOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftToolbarDrawOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
