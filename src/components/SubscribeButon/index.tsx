import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import { api } from '../../services/api'
import { getStripeJS } from '../../services/stripe-client'
import styles from './styles.module.scss'



export function SubscribeButton() {
  const { status, data } = useSession()


  const router = useRouter()

  async function handleSubscribe() {
    if (!data) {
      signIn('github')
      return
    }

    if (data.activeSubscription) {
      return router.push('/posts')
    }

    try {
      const response = await api.post('/subscribe')
      const { sessionId } = response.data

      const stripe = await getStripeJS()

      await stripe.redirectToCheckout({ sessionId: sessionId.id })
    } catch (err) {
      console.log(err)
      alert(err.message)
    }

    //criação do checkout session

  }

  return (
    <button
      className={styles.subscribeButton}
      type='button'
      onClick={handleSubscribe}>Subscribe now
    </button>
  )
}