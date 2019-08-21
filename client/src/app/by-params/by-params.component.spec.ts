import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ByParamsComponent } from './by-params.component';

describe('ByParamsComponent', () => {
  let component: ByParamsComponent;
  let fixture: ComponentFixture<ByParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ByParamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ByParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
