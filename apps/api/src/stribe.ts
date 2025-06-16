import { Stripe } from "stripe";

import { TSafeUser, TUser } from "./db/handlers/userHandler";
import { TEvent } from "./db/handlers/eventHandler";

/**
 * @description
 * The stribe handler, used for integrating with their service
 */
class StribeHandler {
  #s: Stripe;

  constructor(secretKey: string) {
    this.#s = new Stripe(secretKey);
  }

  /**
   * @description
   * Will create a new customer in stribe
   * @param user - The user to create as a customer in stribe
   * @returns - The id of the user
   */
  async createCustomer(user: TSafeUser): Promise<string> {
    const customerResponse = await this.#s.customers.create({
      email: user.email,
      preferred_locales: ["DK"],
    });

    return customerResponse.id;
  }

  /**
   * @description
   * Creates a product and price in stribe from an event
   * @param product - The product to create in stribe
   * @returns The id's of the created prodcut and price
   */
  async createProduct(
    product: TEvent,
    price: number
  ): Promise<{ productId: string; priceId: string }> {
    const productResponse = await this.#s.products.create({
      name: product.name,
    });

    const priceResponse = await this.#s.prices.create({
      product: productResponse.id,
      unit_amount: price,
      currency: "dkk",
    });

    return { productId: productResponse.id, priceId: priceResponse.id };
  }

  async createSession(
    customerId: string,
    product: { priceId: string; quantity: number },
    urls: { success: string; cancel: string }
  ) {
    const sessionResponse = await this.#s.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        customer: customerId,
        line_items: [{ price: product.priceId, quantity: product.quantity }],
        mode: "payment",
        success_url: urls.success,
        cancel_url: urls.cancel,
      },
      undefined
    );

    return sessionResponse.url;
  }
}

export default StribeHandler;
