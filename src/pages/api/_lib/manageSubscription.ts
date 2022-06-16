import { fauna } from '../../../services/faunadb'
import { query as q } from 'faunadb'
import { stripe } from '../../../services/stripe'

export async function saveSubscription(subscriptionId: string, customerId: string, createAction = false) {
  //buscar usuário no banco do fauna com o id
  //salvar os dados da subscription no banco

  const useRef = await fauna.query(
    q.Select('ref',
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId))))


  const subscription = await stripe.subscriptions.retrieve(subscriptionId)


  const subscritptionData = {
    id: subscription.id,
    userId: useRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,


  }

  if (createAction) {
    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        { data: subscritptionData }))

  } else {
    await fauna.query(q.Replace(
      q.Select(
        'ref',
        q.Get(
          q.Match(
            q.Index('subscription_by_id'), subscriptionId
          )

        )
      ),
      { data: subscritptionData }
    )
    )
  }
}


