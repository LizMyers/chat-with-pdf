import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import stripe from '@/lib/stripe';
import Stripe from 'stripe';
import { adminDb } from '../../firebaseAdmin';

export async function POST(req: NextRequest) {
  console.log('Webhook API route called');

  // Read the headers and body from the request
  const headersList = headers(); 
  const body = await req.text(); // Must use req.text() for raw body text
  const signature = headersList.get('stripe-signature');

  // Check if the Stripe signature is present
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  // Ensure the Stripe webhook secret is set in the environment variables
 // stripe listen --forward-to localhost:3000/webhook <== run this command in the terminal  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("⚠️ Stripe webhook secret is not set.");
    return new NextResponse("Stripe webhook secret is not set", { status: 400 });
  }

  let event: Stripe.Event;

  // Verify the webhook signature and parse the event
  try {
    event = stripe.webhooks.constructEvent(
      body, // Payload, body text from req.text()
      signature,
      process.env.STRIPE_WEBHOOK_SECRET 
    );
  } catch (err) {
    console.error(`Webhook Error: ${err}`);
    return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
  }

  // Helper function to get user details by Stripe customer ID
  const getUserDetails = async (customerId: string) => {
    const userDoc = await adminDb
      .collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (!userDoc.empty) {
      return userDoc.docs[0]; // Return the user document
    }
    return null; // Return null if user not found
  };

  // Handle different Stripe event types
  switch (event.type) {
    case "checkout.session.completed":
    case "payment_intent.succeeded": {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;
      console.log('🚀 ~ POST ~ Event type:', event.type);
      console.log('🚀 ~ POST ~ customerId:', customerId);

      const userDetails = await getUserDetails(customerId);
      if (!userDetails) {
        console.log('🚀 ~ POST ~ User not found for customerId:', customerId);
        return new NextResponse('User not Found', { status: 400 });
      }

      console.log('🚀 ~ POST ~ Updating subscription status for user:', userDetails.id);
      await adminDb.collection('users').doc(userDetails.id).update({
        hasActiveMembership: true,
      });
      break;
    }
    case "customer.subscription.deleted":
    case "subscription_schedule.canceled": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const userDetails = await getUserDetails(customerId);
      if (!userDetails) {
        return new NextResponse("User not found", { status: 404 });
      }

      await adminDb.collection("users").doc(userDetails.id).update({
        hasActiveMembership: false,
      });
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ message: "Webhook received" });
}