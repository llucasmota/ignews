/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react'
import { fauna } from '../../services/faunadb';
import { query as q } from 'faunadb'
import { stripe } from '../../services/stripe';

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer: string;
  };
};


export default async (req: NextApiRequest, response: NextApiResponse) => {
  if (req.method === 'POST') {
    const session = await getSession({ req })

    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"),
        q.Casefold(session.user.email)))
    );

    let customerId = user.data.stripe_customer


    if (!customerId) {
      const stripeCustumer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name
      })
      await fauna.query(q.Update(q.Ref(q.Collection('users'), user.ref?.id),
        {
          data: { stripe_customer: stripeCustumer.id }
        }
      ))
      customerId = stripeCustumer.id
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          price: 'price_1KRQfyAI09OUmUrDLOru09Bf'
          , quantity: 1
        }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    return response.status(200).json({ sessionId: checkoutSession })

  } else {
    response.setHeader('Allow', 'POST')
    response.status(405).end('Method not allowed')
  }
}

