import {
  PixelEventName,
  PixelConfiguration,
  PixelEventProperties,
} from './pixel.models';
import {
  Inject,
  Injectable,
  Optional,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

declare const fbq: (
  type: 'track' | 'trackCustom',
  eventName: PixelEventName | string,
  properties?: PixelEventProperties
) => void;

@Injectable({
  providedIn: 'root',
})
export class PixelService {
  private doc: Document;
  private renderer: Renderer2;

  constructor(
    @Inject('config') private config: PixelConfiguration,
    @Inject(DOCUMENT) private injectedDocument: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() private router: Router,
    private rendererFactory: RendererFactory2
  ) {
    // DOCUMENT cannot be injected directly as Document type, see https://github.com/angular/angular/issues/20351
    // It is therefore injected as any and then cast to Document
    this.doc = injectedDocument as Document;
    this.renderer = rendererFactory.createRenderer(null, null);

    if (router) {
      // Log page views after router navigation ends
      router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event) => {
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
      console.warn(
        'Tried to initialize a Pixel instance while another is already active. Please call `remove()` before initializing a new instance.'
      );
      return;
    }
    this.config.enabled = true;
    this.addPixelScript(pixelId, this.config.appId);
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
  track(eventName: PixelEventName, properties?: PixelEventProperties): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.isLoaded()) {
      console.warn(
        'Tried to track an event without initializing a Pixel instance. Call `initialize()` first.'
      );
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
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.isLoaded()) {
      console.warn(
        'Tried to track an event without initializing a Pixel instance. Call `initialize()` first.'
      );
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
   * @param appId The Facebook Pixel APP ID to use
   */
  private addPixelScript(pixelId: string, appId?: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const scriptMobileBridge = appId
      ? `fbq('set', 'mobileBridge', '${pixelId}', '${appId}')`
      : '';

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
      ${scriptMobileBridge}
    fbq('track', 'PageView');`;

    const scriptElement = this.renderer.createElement('script');
    this.renderer.setAttribute(scriptElement, 'id', 'pixel-script');
    this.renderer.setAttribute(scriptElement, 'type', 'text/javascript');
    this.renderer.setProperty(scriptElement, 'innerHTML', pixelCode);
    this.renderer.appendChild(this.doc.head, scriptElement);
  }

  /** Remove Facebook Pixel tracking script from the application */
  private removePixelScript(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const pixelElement = this.doc.getElementById('pixel-script');
    if (pixelElement) {
      pixelElement.remove();
    }
  }

  /** Checks if the script element is present */
  private isLoaded(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const pixelElement = this.doc.getElementById('pixel-script');
      return !!pixelElement;
    }
    return false;
  }
}
