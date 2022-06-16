
import { render, screen, fireEvent } from '@testing-library/react'
import { createMock } from 'ts-jest-mock'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { SubscribeButton } from '.'


jest.mock('next-auth/react')

jest.mock('next/router')

describe('Subscribe button tests', () => {
  it('Render correctly', () => {
    const useSessionMocked = createMock(useSession)

    useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' })
    render(
      <SubscribeButton />
    )
    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })
  it('redirects user to sign in when not authenticated', () => {
    const useSessionMocked = createMock(useSession)

    useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' })

    const signInMocked = createMock(signIn)

    render(
      <SubscribeButton />
    )

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)
    expect(signInMocked).toHaveBeenCalled()
  })
  it('redirects to posts when user already has a subscription', () => {

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

    const useRouterMocked = createMock(useRouter)

    const pushMocked = jest.fn()

    useRouterMocked.mockReturnValueOnce({ push: pushMocked } as any)

    render(<SubscribeButton />)

    const subscriptionButton = screen.getByText('Subscribe now')
    fireEvent.click(subscriptionButton)
    expect(pushMocked).toHaveBeenCalledWith('/posts')

  })
})

export { }