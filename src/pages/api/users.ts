import { NextApiRequest, NextApiResponse } from 'next'


export default function Users(request: NextApiRequest, response: NextApiResponse) {
  const users = [
    { id: 1, name: 'Lucas' },
    { id: 1, name: 'Lucas' },
    { id: 1, name: 'Lucas' }
  ]

  return response.json(users)

}