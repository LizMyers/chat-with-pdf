import { adminDb } from "@/firebaseAdmin";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    const headersList = headers();
    const body = await req.text();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
        console.log('DEBUG: No signature');
        return new Response('No signature', { status: 400 });
    }

    if (!body) {
        console.log('DEBUG: No body');
        return new Response('No body', { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.log('DEBUG: Stripe webhook secret is not set.');
        return new Response('Stripe webhook secret is not set.', { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = Stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        console.log('DEBUG: Event constructed successfully');
    } catch (err) {
        console.error('DEBUG: Invalid signature', err);
        return new Response('Invalid signature', { status: 400 });
    }

    const getUserDetails = async (customerId: string) => {
        const userDoc = await adminDb
            .collection('users')
            .where('stripeCustomerId', '==', customerId)
            .limit(1)
            .get();

        if (!userDoc.empty) {
            console.log('DEBUG: User found with customerId', customerId);
            return userDoc.docs[0];
        } else {
            console.log('DEBUG: No user found with customerId', customerId);
            return null;
        }
    }

    try {
        switch (event.type) {
            case "checkout.session.completed":
            case "payment_intent.succeeded": {
                const invoice = event.data.object;
                const customerId = invoice.customer as string;

                const userDetails = await getUserDetails(customerId);
                if (!userDetails?.id) {
                    console.log('DEBUG: User not found');
                    return new Response('User not found', { status: 404 });
                } else {
                    console.log('DEBUG: User found with customerId', userDetails.id);
                }

                // Update user's subscription status
                await adminDb.collection('users').doc(userDetails.id).update({
                    hasActiveMembership: true,
                });
                console.log('DEBUG: Updated hasActiveMembership to true for user:', userDetails.id);
                break;
            }
            case "customer.subscription.deleted":
            case "subscription_schedule.canceled": {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                const userDetails = await getUserDetails(customerId);
                if (!userDetails) {
                    console.log('DEBUG: User not found');
                    return new Response('User not found', { status: 404 });
                }

                console.log('DEBUG: Updating hasActiveMembership to false for user:', userDetails.id);

                // Update user's subscription status
                await adminDb.collection('users').doc(userDetails.id).update({
                    hasActiveMembership: false,
                });
                console.log('DEBUG: Updated hasActiveMembership to false for user:', userDetails.id);
                break;
            }
            default: {
                console.log(`Unhandled event type ${event.type}`);
            }
        }

        return NextResponse.json({ message: "webhook received" });
    } catch (err) {
        console.error('DEBUG: Error processing event', err);
        return new Response('Internal Server Error', { status: 500 });
    }
}