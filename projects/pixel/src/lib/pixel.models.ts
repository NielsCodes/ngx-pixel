export interface PixelConfiguration {
  /** Whether to start tracking immediately. Default is `false` */
  enabled?: boolean;
  /** Your Facebook Pixel ID */
  pixelId: string;
}

export interface PixelEventProperties {
  /** Category of the page/product. */
  content_category?: string;
  /**
   * Product IDs associated with the event, such as SKUs.
   * @example ['ABC123', 'XYZ789']
   */
  content_ids?: string[] | number[];
  /** Name of the page/product. */
  content_name?: string;
  /**
   * If the IDs being passed in `content_ids`or `contents` parameter are IDs of products, then the value should be '**product**'.
   * Either '**product**' or '**product_group**' base on the `content_ids` or `contents` being passed.
   * If product group IDs are being passed, then the value should be '**product_group**'.
   */
  content_type?: 'product' | 'product_group';
  // tslint:disable-next-line: max-line-length
  /** An array of JSON objects that contains the quantity and the International Article Number (EAN) when applicable, or other product or content identifier(s).
   * id and quantity are the required fields.
   * @example [{'id': 'ABC123', 'quantity': 2}, {'id': 'XYZ789', 'quantity': 2}]
   */
  contents?: object[];
  /** The currency for the `value` specified. */
  currency?: string;
  /**
   * Used with `InitiateCheckout` event.
   * The number of items when checkout was initiated.
   */
  num_items?: number;
  /** Predicted lifetime value of a subscriber as defined by the advertiser and expressed as an exact value. */
  predicted_ltv?: number;
  /**
   * Used with the `Search` event.
   * The string entered by the user for the search.
   */
  search_string?: string;
  /** Used with the `CompleteRegistration` event, to show the status of the registration. */
  status?: boolean;
  /** The value of a user performing this event to the business. */
  value?: number;
}
