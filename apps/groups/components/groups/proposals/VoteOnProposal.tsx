'use client'

import { ResultTx } from 'chora/components'
import { InputString, SelectDataStorage } from 'chora/components/forms'
import {
  SelectExecution,
  SelectVote,
} from 'chora/components/forms/cosmos.group.v1'
import { WalletContext } from 'chora/contexts'
import { useNetworkServer } from 'chora/hooks'
import { signAndBroadcast } from 'chora/utils'
import { MsgVote } from 'cosmos/api/cosmos/group/v1/tx'
import * as jsonld from 'jsonld'
import * as Long from 'long'
import { useParams } from 'next/navigation'
import { useContext, useState } from 'react'

import { usePermissionsMember } from '@hooks/usePermissionsMember'

import styles from './VoteOnProposal.module.css'

const VoteOnProposal = () => {
  const { id } = useParams()
  const { chainInfo, network, wallet } = useContext(WalletContext)

  const [serverUrl] = useNetworkServer(chainInfo)

  const [isMember, isAuthz] = usePermissionsMember(
    wallet,
    '/cosmos.group.v1.MsgVote',
  )

  // form inputs
  const [vote, setVote] = useState<string>('')
  const [reason, setReason] = useState<string>('')
  const [execution, setExecution] = useState<string>('')

  // data storage
  const [dataStorage, setDataStorage] = useState<string>('json')

  // error and success
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<any>(null)

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setError(null)
    setSuccess(null)

    let metadata: string = ''

    // handle data storage json
    if (dataStorage === 'json') {
      metadata = JSON.stringify({
        reason: reason,
      })
    }

    // handle data storage iri
    if (dataStorage === 'server') {
      // set JSON-LD document
      const doc = {
        '@context': 'https://schema.chora.io/contexts/group_vote.jsonld',
        reason: reason,
      }

      // check and normalize JSON-LD document
      const normalized = await jsonld
        .normalize(doc, {
          algorithm: 'URDNA2015',
          format: 'application/n-quads',
        })
        .catch((err) => {
          setError(err.message)
          return
        })

      // return error if empty
      if (normalized == '') {
        setError('JSON-LD empty after normalized')
        return
      }

      // set post request body
      const body = {
        canon: 'URDNA2015',
        context: 'https://schema.chora.io/contexts/group_vote.jsonld',
        digest: 'BLAKE2B_256',
        jsonld: JSON.stringify(doc),
        merkle: 'UNSPECIFIED',
      }

      let iri: string | undefined

      // post data to network server
      await fetch(serverUrl + '/data', {
        method: 'POST',
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code) {
            setError(data.message)
          } else {
            iri = network.includes('chora')
              ? data['iri']
              : network.split('-')[0] + ':' + data['iri'].split(':')[1]
          }
        })
        .catch((err) => {
          setError(err.message)
        })

      // return error if iri never set
      if (typeof iri === 'undefined') {
        return
      }

      metadata = iri
    }

    // set submit proposal message
    const msg = {
      $type: 'cosmos.group.v1.MsgVote',
      voter: wallet.bech32Address,
      proposalId: Long.fromString(`${id}`),
      option: vote,
      metadata: metadata,
      exec: execution,
    } as unknown as MsgVote

    // convert message to any message
    const msgAny = {
      typeUrl: '/cosmos.group.v1.MsgVote',
      value: MsgVote.encode(msg).finish(),
    }

    // sign and broadcast message to selected network
    await signAndBroadcast(chainInfo, wallet['bech32Address'], [msgAny])
      .then((res) => {
        setSuccess(res)
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  return (
    <div className={styles.box}>
      <div className={styles.boxOptions}>
        <span style={{ fontSize: '0.9em', marginRight: '1.5em', opacity: 0.5 }}>
          <b>{isMember ? '✓' : 'x'}</b>
          <span style={{ marginLeft: '0.5em' }}>{'group member'}</span>
        </span>
        <span style={{ fontSize: '0.9em', marginRight: '1.5em', opacity: 0.5 }}>
          <b>{isAuthz ? '✓' : 'x'}</b>
          <span style={{ marginLeft: '0.5em' }}>{'authz grantee'}</span>
        </span>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <SelectVote
          id="vote-option"
          label="vote option"
          vote={vote}
          setVote={setVote}
        />
        <InputString
          id="vote-reason"
          label="vote reason"
          placeholder="This proposal needs to be amended and resubmitted."
          string={reason}
          setString={setReason}
        />
        <SelectExecution
          id="proposal-execution"
          label="proposal execution"
          execution={execution}
          setExecution={setExecution}
        />
        <hr />
        <SelectDataStorage
          network={network}
          dataStorage={dataStorage}
          setDataStorage={setDataStorage}
        />
        <button type="submit">{'submit'}</button>
      </form>
      <div className={styles.boxText}>
        <ResultTx error={error} rest={chainInfo?.rest} success={success} />
      </div>
    </div>
  )
}

export default VoteOnProposal
