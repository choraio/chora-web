import { WalletContext } from 'chora'
import { useContext, useEffect, useState } from 'react'

import MemberPreview from '@components/members/MemberPreview'
import { useGroupMembers } from '@hooks/useGroupMembers'

import styles from './Members.module.css'

const Members = () => {
  const { chainInfo } = useContext(WalletContext)

  // fetch group members from selected network
  const [members, error] = useGroupMembers(chainInfo)

  // list options
  const [sort, setSort] = useState<string>('ascending')
  const [sortedMembers, setSortedMembers] = useState<any[] | null>(null)

  // reset state on network or members change
  useEffect(() => {
    setSort('ascending')
  }, [chainInfo?.chainId, members])

  // sort on load and sort or members change
  useEffect(() => {
    const ms = members ? [...members] : []

    if (members && sort === 'ascending') {
      ms.sort(
        (a: any, b: any) =>
          new Date(b['member']['added_at']).getUTCDate() -
          new Date(a['member']['added_at']).getUTCDate(),
      )
    }

    if (members && sort === 'descending') {
      ms.sort(
        (a: any, b: any) =>
          new Date(a['member']['added_at']).getUTCDate() -
          new Date(b['member']['added_at']).getUTCDate(),
      )
    }

    setSortedMembers(ms)
  }, [sort, members])

  return (
    <div className={styles.box}>
      <div className={styles.boxOptions}>
        {sort === 'descending' && (
          <button onClick={() => setSort('ascending')}>
            {'sort by newest'}
          </button>
        )}
        {sort === 'ascending' && (
          <button onClick={() => setSort('descending')}>
            {'sort by oldest'}
          </button>
        )}
      </div>
      {!error && !sortedMembers && <div>{'loading...'}</div>}
      {sortedMembers && sortedMembers.length === 0 && (
        <div>{'no sortedMembers found'}</div>
      )}
      {sortedMembers &&
        sortedMembers.map((member: any) => (
          <MemberPreview
            key={member['member']['address']}
            member={member['member']}
          />
        ))}
      {error && <div>{error}</div>}
    </div>
  )
}

export default Members
