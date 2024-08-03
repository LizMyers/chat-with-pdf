'use server'

import { UserDetails } from "@/app/dashboard/upgrade/page";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import stripe from "../lib/stripe";
import getBaseUrl from "@/lib/getBaseUrl";


export async function createCheckoutSession(userDetails: UserDetails) {
    auth().protect();
    const { userId } = await auth();

    let stripeCustomerId;

    const user = await adminDb.collection('users').doc(userId!).get();
    stripeCustomerId = user.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
        // create a new stripe customer
        const customer = await stripe.customers.create({
            email: userDetails.email,
            name: userDetails.name,
            metadata: {
                userId,
            },
        });
  
        await adminDb.collection('users').doc(userId!).set({
            stripeCustomerId: customer.id,
        });

        stripeCustomerId = customer.id;
    }

 
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'paypal'],
        customer: stripeCustomerId,
        mode: 'subscription',
        line_items: [
            {
                //price: "price_1PgqJXHRNpQOUjjhvnQUBseI",
                price: "price_1PgwKKKRmXbstzLO4ocAEXeA",
                quantity: 1,
            },
        ],
        success_url: `${getBaseUrl()}/dashboard?upgrade=true`,
        cancel_url: `${getBaseUrl()}/dashboard`,
    });

    return session.id; 
}
