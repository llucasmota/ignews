import { render, screen } from '@testing-library/react'
import { createMock } from 'ts-jest-mock'
import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'
import { stripe } from '../../services/stripe'




jest.mock('../../services/stripe')
jest.mock('../../services/prismic')


const posts = [{
  slug: 'my-new-post', title: 'My new Post', excerpt: 'Post excerpt', updatedAt: '10 de abril'
}]

describe('Posts page', () => {
  it('Must be render correctly', () => {

    render(<Posts posts={posts} />)

    expect(screen.getByText('My new Post')).toBeInTheDocument()
  })
  it('load initial data', async () => {

    const prismicMocked = createMock(getPrismicClient)
    prismicMocked.mockResolvedValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [

        ]
      })
    })

    render(<Posts posts={posts} />)

    expect(screen.getByText('My new Post')).toBeInTheDocument()
  })
})

