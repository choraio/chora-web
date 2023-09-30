'use client'

import { WalletContext } from 'chora'
import { Result } from 'chora/components'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useContext } from 'react'

import Address from '@components/Address'
import { useGroupProposalVotes } from '@hooks/useGroupProposalVotes'

import styles from './ProposalVotes.module.css'

const ProposalVotes = () => {
  const { id } = useParams()

  const { chainInfo } = useContext(WalletContext)

  // fetch proposal votes from selected network
  const [votes, error] = useGroupProposalVotes(chainInfo, `${id}`)

  return (
    <div className={styles.box}>
      {!votes && !error && <div>{'loading...'}</div>}
      {votes &&
        votes.map((vote) => (
          <div className={styles.boxItem} key={vote['voter']}>
            <div className={styles.boxText}>
              <h3>{'voter'}</h3>
              <p>
                {vote && vote['voter'] ? (
                  <Address address={vote['voter']} />
                ) : (
                  'NA'
                )}
              </p>
            </div>
            <div className={styles.boxText}>
              <h3>{'option'}</h3>
              <p>{vote['option']}</p>
            </div>
            <Link href={`/proposals/${id}/${vote['voter']}`}>
              {'view vote'}
            </Link>
          </div>
        ))}
      {votes && votes.length === 0 && !error && <div>{'no votes found'}</div>}
      <Result error={error} />
    </div>
  )
}

export default ProposalVotes
