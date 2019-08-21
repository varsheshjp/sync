import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgSaverComponent } from './img-saver.component';

describe('ImgSaverComponent', () => {
  let component: ImgSaverComponent;
  let fixture: ComponentFixture<ImgSaverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgSaverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgSaverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
