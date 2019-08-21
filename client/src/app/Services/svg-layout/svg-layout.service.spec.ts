import { TestBed, inject } from '@angular/core/testing';

import { SvgLayoutService } from './svg-layout.service';

describe('SvgLayoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SvgLayoutService]
    });
  });

  it('should be created', inject([SvgLayoutService], (service: SvgLayoutService) => {
    expect(service).toBeTruthy();
  }));
});
