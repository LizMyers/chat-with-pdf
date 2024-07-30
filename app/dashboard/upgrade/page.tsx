'use client'

import { startTransition, useState, useTransition } from 'react'
import { Button } from '@/app/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import useSubscription  from '../../hooks/useSubscription'
import { createCheckoutSession } from '@/actions/createCheckoutSession'
import getStripe from '@/lib/stripe-js'
import createStripePortal from '@/actions/createStripePortal'
 

export type UserDetails = {
    email: string;
    name: string;
}

function PricingPage() {
  const { user } = useUser()
  const router = useRouter()
  const { hasActiveMembership, loading } = useSubscription();
  const [ isPending, setIsPending ] = useTransition();

  console.log(hasActiveMembership)

  const handleUpgrade = () => {
    if(!user) return;

    const userDetails = {
        email: user.primaryEmailAddress?.toString()!,
        name: user.fullName!,
    }

    startTransition(async() => {
        const stripe = await getStripe();

        if(hasActiveMembership) {
            const stripePortalUrl = await createStripePortal();
            return router.push(stripePortalUrl);
        }

        const sessionId = await createCheckoutSession(userDetails);

        await stripe?.redirectToCheckout({
            sessionId,
        });
    });
  }

  return (
    <div className="h-screen overflow-y-scroll">
        <div className="py-24 sm:py-32  ">
            <div className='max-w-4xl mx-auto text-center'>
                <h2 className="text-base font-semibold leading-7 text-indigo-600">
                    Pricing
                </h2>
                <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Supercharge your Document Companion
                </p>
            </div>

            <p className='mx-auto mt-6 max-w-2xl px 10 text-center text-lg leading-8 text-gray-600'>
                Choose an affordable plan that's apacked with the best featrues for interacting with your PDFs, enhancing productivity, and streamlining your workflow.
            </p>

            {/* 
              [Open a new terminal and run the following command:]
              stripe listen --forward-to localhost:3000/webhook 
              [
                This command will start listening for events on your Stripe account and forward them to your local server at http://localhost:3000/webhook

                You should copy/paste the webhook signing secret from your Stripe dashboard into the .env.local file.
              ]
            */}

            <div className='max-w-md mx-auto mt-10 grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 md:max-w-2xl gap-8 lg:max-w-4xl'>
                
                {/* FREE */}
                <div className='ring-1 ring-gray-200 p-8 h-fit pb-12 rounded-2xl'>
                    <h3 className='text-lg font-semibold leading-8 text-gray-900 '>
                        Starter Plan
                    </h3>

                    <p className='mt-4 text-sm leading-6 text-gray-600'>
                        Explore Core Features at No Cost
                    </p>

                    <p className='mt-6 flex items-bseline gap-x-1'>
                        <span className='text-4xl font-bold tracking-tight text-gray-900'>
                            Free
                        </span>
                    </p>

                    <ul
                        role="list"
                        className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                    >
                        <li className='flex gap-x-3'>
                            <Check className='w-5 h-6 text-indigo-600' />
                            Documents
                        </li>

                        <li className='flex gap-x-3'>
                            <Check className='w-5 h-6 text-indigo-600' />
                            Up to 3 messages per document
                        </li>

                        <li className='flex gap-x-3'>
                            <Check className='w-5 h-6 text-indigo-600' />
                            Try out the AI Chat Functionality
                        </li>

                    </ul>
                </div>

                {/* PRO */}
                <div className='ring-2 ring-indigo-600 p-8 h-fit pb-12 rounded-2xl'>
                    <h3 className='text-lg font-semibold leading-8 text-indigo-500 '>
                        Pro Plan
                    </h3>

                    <p className='mt-4 text-sm leading-6 text-gray-600'>
                        Maximize Productivity with PRO Features
                    </p>

                    <p className='mt-6 flex items-baseline gap-x-1'>
                        <span className='text-4xl font-bold tracking-tight text-gray-900'>
                            $5.99
                        </span>
                        <span className='text-sm font-semibold leading-6 text-gray-600'>
                            /month
                        </span>
                    </p>

                    <Button className="
                        bg-indigo-600 
                        w-full 
                        text-white 
                        shadow-sm 
                        hover:bg-indigo-500 
                        mt-6 
                        block 
                        rounded-md 
                        px-3 
                        py-2 
                        text-center 
                        text-sm 
                        font-semibold 
                        leading-6 
                        focus-visible:outline 
                        focus-visible:outline-2 
                        focus-visible:outline-offset-2 
                        focus-visible:outline-indigo-600"
                        disabled = { loading|| isPending}
                        onClick = { handleUpgrade }
                        >
                        { isPending || loading 
                            ? 'Loading...'
                            : hasActiveMembership
                            ? 'Manage Plan'
                            : 'Upgrade to Pro'
                        }
                    </Button>

                    <ul
                        role="list"
                        className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                    >
                        <li className='flex gap-x-3'>
                            <Check className='w-5 h-6 text-indigo-600' />
                            Store up to 20 documents
                        </li>

                        <li className='flex gap-x-3'>
                            <Check className='w-5 h-6 text-indigo-600' />
                            Ability to Delete Documents
                        </li>

                        <li className='flex gap-x-3'>
                            <Check className='w-5 h-6 text-indigo-600' />
                            Up to 100 messages per document
                        </li>

                        <li className='flex gap-x-3'>
                            <Check className='w-5 h-6 text-indigo-600' />
                            Full Power AI Chat Functionality with Memory Recall
                        </li>

                        <li className='flex gap-x-3'>
                            <Check className='w-5 h-6 text-indigo-600' />
                            Advanced analytics
                        </li>

                        <li className='flex gap-x-3'>
                            <Check className='w-5 h-6 text-indigo-600' />
                            24-hour support response time
                        </li>
                    </ul>





                </div>

            </div>
        </div>
     </div>
   
  )
}

export default PricingPage