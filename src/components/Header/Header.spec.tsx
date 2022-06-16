import { render, screen } from '@testing-library/react'
import { createMock } from 'ts-jest-mock'
import { useSession } from 'next-auth/react'
import { Header } from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

jest.mock('next-auth/react')

describe('Header component', () => {

  const useSessionMocked = createMock(useSession)
  useSessionMocked.mockReturnValue({ data: null, status: 'unauthenticated' })

  it('Header renders correctly', () => {
    render(
      <Header />
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Posts')).toBeInTheDocument()

  })
})


