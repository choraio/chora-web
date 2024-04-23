'use client'

import { Result } from 'chora/components'
import { SelectOptionInput } from 'chora/components/forms'
import {
  InputContentHash,
  InputContentHashJSON,
} from 'chora/components/forms/regen.data.v1'
import { WalletContext } from 'chora/contexts'
import { useContext, useState } from 'react'

import styles from './QueryAnchorByHash.module.css'

const queryAnchorByHash = '/regen/data/v1/anchor-by-hash'

const QueryAnchorByHash = () => {
  const { chainInfo } = useContext(WalletContext)

  const [input, setInput] = useState('form')
  const [contentHash, setContentHash] = useState<any>(null)
  const [contentHashJson, setContentHashJson] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<any>(null)

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setError(null)
    setSuccess(null)

    let body: string

    if (input == 'form') {
      body = JSON.stringify({ contentHash: contentHash })
    } else {
      let ch = ''
      try {
        ch = JSON.parse(contentHashJson)
      } catch (err) {
        setError('invalid json')
        return // exit on error
      }
      body = JSON.stringify({ contentHash: ch })
    }

    fetch(chainInfo.rest + queryAnchorByHash, {
      method: 'POST',
      body: body,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code) {
          setError(data.message)
        } else {
          setSuccess(JSON.stringify(data, null, '  '))
        }
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  const handleSetInput = (input: string) => {
    setInput(input)
    setError(null)
    setSuccess(null)
  }

  return (
    <div id="query-anchor-by-hash" className={styles.box}>
      <div className={styles.boxHeader}>
        <h2>{'QueryAnchorByHash'}</h2>
        <p>{'query a data anchor by the content hash of the data'}</p>
      </div>
      <SelectOptionInput input={input} setInput={handleSetInput} />
      {input == 'form' ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <InputContentHash
            id="query-anchor-by-hash-content-hash"
            contentHash={contentHash}
            setContentHash={setContentHash}
          />
          <button type="submit">{'search'}</button>
        </form>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <InputContentHashJSON
            id="query-anchor-by-hash-content-hash"
            json={contentHashJson}
            setJson={setContentHashJson}
          />
          <button type="submit">{'search'}</button>
        </form>
      )}
      <Result error={error} success={success} />
    </div>
  )
}

export default QueryAnchorByHash
