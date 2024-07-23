import { Metadata } from 'next'

import Network from '@components/network/Network'

import styles from './page.module.css'

export const metadata: Metadata = {
  title: `chora ledger`,
}

const NetworkPage = () => (
  <div className={styles.page}>
    <h1>{'network'}</h1>
    <Network />
  </div>
)

export default NetworkPage
