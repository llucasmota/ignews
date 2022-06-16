/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react'
import { SubscribeButton } from '../components/SubscribeButon'
import { stripe } from '../services/stripe'
import styles from '../styles/home.module.scss'
interface HomeProps {
  product: {
    priceId: string;
    amount: string
  }
}
export default function Home({ product }: HomeProps) {


  return (
    <>
      <Head>
        <title>Home | Ig News</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏🏾 Hey, welcome</span>
          <h1>News about
            the <span>React</span> world</h1>
          <p>Get acess to all the publications <br />
            <span>for {product.amount} month</span></p>
          <SubscribeButton />
        </section>
        <img src='/images/avatar.svg' alt='dasda' />
      </main>

    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1KRQfyAI09OUmUrDLOru09Bf', {
    expand: ['product']
  })


  const product = {
    price: price.id,
    amount: new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100)
  }

  return {
    props: { product },
    revalidate: 20 //24 hours

  }
}
