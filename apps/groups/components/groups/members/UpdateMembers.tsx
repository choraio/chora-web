'use client'

import { ResultTx } from 'chora/components'
import { InputMembers } from 'chora/components/forms/cosmos.group.v1'
import { WalletContext } from 'chora/contexts'
import { signAndBroadcast } from 'chora/utils'
import { MsgUpdateGroupMembers } from 'cosmos/api/cosmos/group/v1/tx'
import * as Long from 'long'
import { useParams } from 'next/navigation'
import { useContext, useState } from 'react'

import { GroupContext } from '@contexts/GroupContext'
import { usePermissionsAdmin } from '@hooks/usePermissionsAdmin'

import styles from './UpdateMembers.module.css'

const UpdateMembers = () => {
  const { groupId } = useParams()
  const { members: initMembers, membersError } = useContext(GroupContext)
  const { chainInfo, network, wallet } = useContext(WalletContext)

  const [isAdmin, isPolicy, isAuthz] = usePermissionsAdmin(
    wallet,
    '/cosmos.group.v1.MsgUpdateGroupMembers',
  )

  // form inputs
  const [members, setMembers] = useState<any[]>([])

  // error and success
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<any>(null)

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setError(null)
    setSuccess(null)

    // set message
    const msg = {
      $type: 'cosmos.group.v1.MsgUpdateGroupMembers',
      admin: wallet['bech32Address'],
      groupId: Long.fromString(`${groupId}` || '0'),
      memberUpdates: members,
    } as unknown as MsgUpdateGroupMembers

    // convert message to any message
    const msgAny = {
      typeUrl: '/cosmos.group.v1.MsgUpdateGroupMembers',
      value: MsgUpdateGroupMembers.encode(msg).finish(),
    }

    // sign and broadcast message to selected network
    await signAndBroadcast(chainInfo, wallet['bech32Address'], [msgAny])
      .then((res) => {
        setSuccess(res)
      })
      .catch((err) => {
        if (err.message === "Cannot read properties of null (reading 'key')") {
          setError('keplr account does not exist on the selected network')
        } else {
          setError(err.message)
        }
      })
  }

  return (
    <div className={styles.box}>
      <div className={styles.boxOptions}>
        <span style={{ fontSize: '0.9em', marginRight: '1.5em', opacity: 0.5 }}>
          <b>{isAdmin ? '✓' : 'x'}</b>
          <span style={{ marginLeft: '0.5em' }}>{'admin account'}</span>
        </span>
        <span style={{ fontSize: '0.9em', marginRight: '1.5em', opacity: 0.5 }}>
          <b>{isPolicy ? '✓' : 'x'}</b>
          <span style={{ marginLeft: '0.5em' }}>{'policy + member'}</span>
        </span>
        <span style={{ fontSize: '0.9em', marginRight: '1.5em', opacity: 0.5 }}>
          <b>{isAuthz ? '✓' : 'x'}</b>
          <span style={{ marginLeft: '0.5em' }}>{'authz grantee'}</span>
        </span>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <InputMembers
          id="group-members"
          network={network}
          members={members}
          initMembers={initMembers.map((m: any) => m.member)}
          setMembers={setMembers}
        />
        <button type="submit">{'submit'}</button>
      </form>
      <div className={styles.boxText}>
        <ResultTx
          error={membersError || error}
          rest={chainInfo?.rest}
          success={success}
        />
      </div>
    </div>
  )
}

export default UpdateMembers
