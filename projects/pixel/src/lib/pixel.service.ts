import { PixelEventName, PixelConfiguration, PixelEventProperties } from './pixel.models';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import {isPlatformBrowser} from '@angular/common';

declare var fbq: any;

@Injectable({
  providedIn: 'root'
})
export class PixelService {

  constructor(
    @Inject('config') private config: PixelConfiguration,
    // tslint:disable-next-line:ban-types
    @Inject(PLATFORM_ID) public platformId: Object,
    @Optional() private router: Router
  ) {

    if (router && isPlatformBrowser(platformId)) {
      // Log page views after router navigation ends
      router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {

        if (this.isLoaded()) {
          this.track('PageView');
        }

      });
    }

  }

  /**
   * Initialize the Pixel tracking script
   * - Adds the script to page's head
   * - Tracks first page view
   */
  initialize(pixelId = this.config.pixelId): void {
    if (this.isLoaded()) {
      console.warn('Tried to initialize a Pixel instance while another is already active. Please call `remove()` before initializing a new instance.');
      return;
    }
    this.config.enabled = true;
    this.addPixelScript(pixelId);
  }

  /** Remove the Pixel tracking script */
  remove(): void {
    this.removePixelScript();
    this.config.enabled = false;
  }

  /**
   * Track a Standard Event as predefined by Facebook
   *
   * See {@link https://developers.facebook.com/docs/facebook-pixel/reference Facebook Pixel docs - reference}
   * @param eventName The name of the event that is being tracked
   * @param properties Optional properties of the event
   */
  track(
    eventName: PixelEventName,
    properties?: PixelEventProperties
    ): void {
    if(!this.isLoaded()) {
      console.warn('Tried to track an event without initializing a Pixel instance. Call `initialize()` first.');
      return;
    }

    if (properties) {
      fbq('track', eventName, properties);
    } else {
      fbq('track', eventName);
    }

  }

  /**
   * Track a custom Event
   *
   * See {@link https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking#custom-conversions Facebook Pixel docs - custom conversions}
   * @param eventName The name of the event that is being tracked
   * @param properties Optional properties of the event
   */
  trackCustom(eventName: string, properties?: object): void {
    if(!this.isLoaded()) {
      console.warn('Tried to track an event without initializing a Pixel instance. Call `initialize()` first.');
      return;
    }

    if (properties) {
      fbq('trackCustom', eventName, properties);
    } else {
      fbq('trackCustom', eventName);
    }
  }

  /**
   * Adds the Facebook Pixel tracking script to the application
   * @param pixelId The Facebook Pixel ID to use
   */
  private addPixelScript(pixelId: string): void {

    if(isPlatformBrowser(this.platformId)) {
      const pixelCode = `
    var pixelCode = function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');`;

      const scriptElement = document.createElement('script');
      scriptElement.setAttribute('id', 'pixel-script');
      scriptElement.type = 'text/javascript';
      scriptElement.innerHTML = pixelCode;
      document.getElementsByTagName('head')[0].appendChild(scriptElement);
    }
  }

  /** Remove Facebook Pixel tracking script from the application */
  private removePixelScript(): void {
    if(isPlatformBrowser(this.platformId)) {
      const pixelElement = document.getElementById('pixel-script');
      if (pixelElement) {
        pixelElement.remove();
      }
    }
  }

  /** Checks if the script element is present */
  private isLoaded(): boolean {
    if(isPlatformBrowser(this.platformId)){
      const pixelElement = document.getElementById('pixel-script');
      return !!pixelElement;
    }else{
      return false;
    }
  }

}
