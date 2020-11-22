import { TestBed } from '@angular/core/testing';

import { PixelService } from './pixel.service';

describe('PixelService', () => {
  let service: PixelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PixelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
