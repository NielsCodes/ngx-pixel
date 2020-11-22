# ngx-pixel

![](https://storage.googleapis.com/nielskersic/static-images/github/Angular%20%2B%20FB%20Event%20Mgr.png)

<center>
A simple Angular library to simplify tracking using a Facebook Pixel.
</center>

---

## Introduction
Using a Facebook Pixel is fairly simple. You add the script to the `head` section of all pages, after which you can use the `fbq` function. However, in Angular it's not as straight-forward. The main two problems are as follows:

- Navigation using the Angular Router is not tracked.
- There are no TypeScript definitions by default, so no Intellisense or linting.

***ngx-pixel*** solves both of these issues.

## Usage
Using ***ngx-pixel*** is very simple.

### 1. Installing the NPM package
You can install the NPM package with `npm install ngx-pixel`

### 2. Add it to your app module
Add the library to your app's module, usually `app.module.ts`. Make sure you use the `forRoot()` method. Within this method, add your [Facebook Pixel ID](https://www.facebook.com/business/help/952192354843755). 
```typescript
import { PixelModule } from 'ngx-pixel';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PixelModule.forRoot({ enabled: true, pixelId: 'YOUR_PIXEL_ID'})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
**NOTE:** By default, the library does not start tracking immediately. In most cases this requires user consent to comply with GDPR and other privacy regulations. If you would still like start tracking as soon as your app module loads, include the `enabled: true` parameter in when you call `forRoot()`.

### 3. Add it to your components
In any component where you would like to track certain events, you can import the ***ngx-pixel service*** with `import { PixelService } from 'ngx-pixel';`
Then you can inject the service into your component as follows:
```TypeScript
export class HomeComponent {

  constructor(
    private pixel: PixelService
  ) { }

}
```

### 4. Tracking events
There are two groups of events that you can track, namely *Standard events*  and *Custom events*. 

#### Standard events
**Standard events** are common events that Facebook has created. You can find the full list [here](https://developers.facebook.com/docs/facebook-pixel/reference). You can track a Standard event like this:
![Track Standard events using ngx-pixel](https://storage.googleapis.com/nielskersic/static-images/github/ngx-pixel-track-large.gif)

The first argument is the type of event as defined by Facebook. The optional second argument can be used to pass more information about the event. E.g.: 
```typescript
this.pixel.track('InitiateCheckout', {
  content_ids: ['ABC123', 'XYZ456'],  // Item SKUs
  value: 100,                         // Value of all items
  currency: 'USD'                     // Currency of the value
});
```

#### Custom events
Tracking **Custom events** works very similar to tracking Standard events. The only major difference is that there are no TypeScript interfaces and therefore no Intellisense. This is because the event *name* and optional *properties* can be anything. Tracking a custom event with ***ngx-pixel*** looks like this:
```TypeScript
this.pixel.trackCustom('MyCustomEvent');
```

And just like with Standard events, you can add more properties. This is recommended, since this enables you to create even more specific audiences within Facebook Business Manager. Which properties you add is completely up to you. Here is an example:
```TypeScript
this.pixel.trackCustom('MyCustomEvent', {
  platform: 'limewire'
})
```

## Important notes
- ***ngx-pixel*** was developed using Angular 11, which uses the Ivy compiler instead of the older View Engine compiler. If your project uses Angular 8 or earlier, or if you decided to keep using View Engine with newer Angular versions, ***ngx-pixel*** might not be compatible, although I have not yet tested this to confirm.

## What's next?
- [ ] Checking Pixel ID's using a RegEx. I first want to confirm whether all Pixel ID's follow the same format.
- [ ] Adding tests.
- [ ] Testing View Engine backwards-compatibility.

---
<center>
Created with ❤️ by Niels Kersic, [niels.codes](https://niels.codes).
</center>






