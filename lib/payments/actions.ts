'use server';

import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { validatedActionWithUser } from '@/lib/auth/middleware';
import { z } from 'zod';

const checkoutSchema = z.object({
  priceId: z.string()
});

export const checkoutAction = validatedActionWithUser(checkoutSchema, async (data, _, user) => {
  if (!user) throw new Error('User not found');

  try {
    const sessionUrl = await createCheckoutSession({ user, priceId: data.priceId });
    return { success: true, url: sessionUrl };
  } catch (error) {
    throw error;
  }
});

export const customerPortalAction = validatedActionWithUser(z.object({}), async (_, __, user) => {
  if (!user) throw new Error('User not found');

  if (!user.stripeCustomerId || !user.stripeProductId) {
    return { success: false, error: 'No active subscription found' };
  }

  try {
    const portalSession = await createCustomerPortalSession(user);
    return { success: true, url: portalSession.url };
  } catch (error) {
    throw error;
  }
});
