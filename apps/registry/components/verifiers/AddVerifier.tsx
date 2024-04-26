'use client'

import { WalletContext } from 'chora/contexts'
import { useContext } from 'react'

import { usePermissions } from '@hooks/usePermissions'

import styles from './AddVerifier.module.css'

const AddVerifier = () => {
  const { wallet } = useContext(WalletContext)

  const [isAuthz] = usePermissions(wallet, '/chora.ecosystem.v1.MsgAddVerifier')

  return (
    <div id="msg-add-verifier" className={styles.box}>
      <div className={styles.boxOptions}>
        <span style={{ fontSize: '0.9em', marginRight: '1.5em', opacity: 0.5 }}>
          <b>{'✓'}</b>
          <span style={{ marginLeft: '0.5em' }}>{'new operator'}</span>
        </span>
        <span style={{ fontSize: '0.9em', marginRight: '1.5em', opacity: 0.5 }}>
          <b>{isAuthz ? '✓' : 'x'}</b>
          <span style={{ marginLeft: '0.5em' }}>{'authz grantee'}</span>
        </span>
      </div>
      <div>{'coming soon...'}</div>
    </div>
  )
}

export default AddVerifier
