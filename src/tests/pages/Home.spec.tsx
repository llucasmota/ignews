import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { createMock } from 'ts-jest-mock'
import Home, { getStaticProps } from '../../pages'
import { stripe } from '../../services/stripe'


jest.mock('next-auth/react')
jest.mock('../../services/stripe')

describe('Home Page', () => {
  it('Must be render correctly', () => {
    const useSessionMocked = createMock(useSession)

    useSessionMocked.mockReturnValueOnce({
      data:
      {
        user: {
          email: 'lucas.mota@gmail.com',
          name: 'Lucas Mota'
        },
        activeSubscription: 'jonh doe',
        expires: 'teste'
      },
      status: 'authenticated'
    })
    render(<Home product={{ priceId: 'fake-price-id', amount: 'R$10,00' }} />)

    expect(screen.getByText('for R$10,00 month')).toBeInTheDocument()
  })
  it('Load data from getStaticProps function', async () => {
    const retrieveStripePriceMocked = createMock(stripe.prices.retrieve)

    retrieveStripePriceMocked.mockResolvedValueOnce({ id: 'fake-price-id', unit_amount: 1000 } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(expect.objectContaining({
      props: {
        product: {
          price: 'fake-price-id',
          amount: '$10.00'
        }
      },
      revalidate: 20
    }))

  })
})