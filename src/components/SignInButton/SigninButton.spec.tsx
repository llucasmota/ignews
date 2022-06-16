import { render, screen } from '@testing-library/react'
import { createMock } from 'ts-jest-mock'
import { useSession, SessionProvider } from 'next-auth/react'
import { SignInButton } from '.'

jest.mock('next-auth/react')

describe('SignIn Button Component', () => {
  it('render correctly when user is not autheticated', () => {
    const useSessionMocked = createMock(useSession)

    useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' })

    render(
      <SignInButton />
    )

    expect(screen.getByText('Sign in with Github')).toBeInTheDocument()
  })
  it('render correctly when user is autheticated', () => {
    const useSessionMocked = createMock(useSession)

    useSessionMocked.mockReturnValueOnce({
      data:
      {
        user: {
          email: 'lucas.mota@gmail.com',
          name: 'Lucas Mota'
        },
        expires: 'teste'
      },
      status: 'authenticated'
    })

    render(
      <SignInButton />
    )

    expect(screen.getByText('Lucas Mota')).toBeInTheDocument()
  })

})