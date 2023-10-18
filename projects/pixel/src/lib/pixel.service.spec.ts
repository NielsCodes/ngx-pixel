import { TestBed } from '@angular/core/testing';

import { PixelService } from './pixel.service';
import { PLATFORM_ID } from '@angular/core';
import { PixelEventName, PixelEventProperties } from './pixel.models';

declare const fbq: (
  type: 'track' | 'trackCustom',
  eventName: PixelEventName | string,
  properties?: PixelEventProperties
) => void;

describe('PixelService', () => {
  let service: PixelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'config', useValue: { enabled: true, pixelId: '123000' } },
      ],
    });
    service = TestBed.inject(PixelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should console a warning when the script was already loaded', () => {
    service.initialize('12000');
    spyOn(console, 'warn');
    service.initialize('12000');
    expect(console.warn).toHaveBeenCalledWith(
      'Tried to initialize a Pixel instance while another is already active. Please call `remove()` before initializing a new instance.'
    );
  });

  it('should console a warning when the script wasnt loaded', () => {
    service.remove();
    spyOn(console, 'warn');
    service.track('AddToCart');
    expect(console.warn).toHaveBeenCalledWith(
      'Tried to track an event without initializing a Pixel instance. Call `initialize()` first.'
    );
  });
});
