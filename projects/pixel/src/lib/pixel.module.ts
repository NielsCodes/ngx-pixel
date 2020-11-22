import { PixelConfiguration } from './pixel.models';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { PixelService } from './pixel.service';

@NgModule({
  imports: [
  ],
})
export class PixelModule {

  private static config: PixelConfiguration;

  constructor( private pixel: PixelService ) {
    if (PixelModule.config.enabled) {
      // TODO: Call initialization function
    }
  }

  /**
   * Initiale the Facebook Pixel Module
   * Add your Pixel ID as parameter
   */
  static forRoot(config: PixelConfiguration): ModuleWithProviders<PixelModule> {
    this.config = config;
    const pixelId = config.pixelId;
    this.verifyPixelId(pixelId);

    return {
      ngModule: PixelModule,
      providers: [PixelService, { provide: 'config', useValue: config }]
    };
  }

  /**
   * Verifies the Pixel ID that was passed into the configuration.
   * - Checks if Pixel was initialized
   * @param pixelId Pixel ID to verify
   */
  private static verifyPixelId(pixelId: string): void {

    // Regular expression for Pixel ID format (15 digits) (not yet implemented)
    const regex = /^\d{15}$/;

    // TODO: Check validity of Pixel ID with a RegEx.
    // Have to verify first that all Pixel IDs follow the same 15 digit format
    if (pixelId === null || pixelId === undefined || pixelId.length === 0) {
      throw Error('Invalid Facebook Pixel ID. Did you pass the ID into the forRoot() function?');
    } else if (!regex.test(pixelId)) {
      throw Error('Invalid Facebook Pixel ID. The ID should consist of 15 digits.');
    }

  }

}
