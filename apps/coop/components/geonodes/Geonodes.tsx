'use client'

import { WalletContext } from 'chora'
import { Result } from 'chora/components'
import { useContext } from 'react'

import GeonodePreview from '@components/geonodes/GeonodePreview'
import { useGeonodes } from '@hooks/useGeonodes'

import styles from './Geonodes.module.css'

const Geonodes = () => {
  const { chainInfo } = useContext(WalletContext)

  // fetch nodes (curated by coop) from selected network
  const [nodes, error] = useGeonodes(chainInfo)

  return (
    <div className={styles.box}>
      {!error && !nodes && <div>{'loading...'}</div>}
      {!error && nodes && nodes.length === 0 && <div>{'no nodes found'}</div>}
      {nodes &&
        nodes.map((node) => <GeonodePreview key={node['id']} node={node} />)}
      <Result error={error} />
    </div>
  )
}

export default Geonodes
