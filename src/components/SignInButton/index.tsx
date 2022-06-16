import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import styles from './styles.module.scss'
import { signIn, useSession, signOut } from 'next-auth/react'
import { Session } from 'next-auth';

export function SignInButton() {

  const isUserLoggedIn = false;

  const { status, data } = useSession()

  return status === 'authenticated' ? (
    <button className={styles.signInButton} type="button" onClick={() => signOut()}>
      <FaGithub color={'#04D361'} />
      {data.user?.name}
      <FiX size={14} color='#737380' className={styles.closeIcon} />
    </button>
  ) : (<button className={styles.signInButton} type="button" onClick={() => signIn('github')}>
    <FaGithub color={'#EBA417'} />
    Sign in with Github
    <FiX size={14} color='#737380' className={styles.closeIcon} />
  </button>)
}