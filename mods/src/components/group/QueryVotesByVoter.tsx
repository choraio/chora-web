
import * as React from "react"
import { useContext, useState } from "react"

import { WalletContext } from "chora"

import InputAddress from "chora/components/InputAddress"
import Result from "chora/components/Result"

import * as styles from "./QueryVotesByVoter.module.css"

const queryVotesByVoter = "/cosmos/group/v1/votes_by_voter"

const QueryVotesByVoter = () => {

  const { chainInfo, network } = useContext(WalletContext)

  // form input
  const [voter, setVoter] = useState<string>("")

  // error and success
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setError("")
    setSuccess("")

    fetch(chainInfo.rest + queryVotesByVoter + "/" + voter)
      .then(res => res.json())
      .then(data => {
        if (data.code) {
          setError(data.message)
        } else {
          setSuccess(JSON.stringify(data, null, "  "))
        }
      })
      .catch(err => {
        setError(err.message)
      })
  }

  return (
    <div id="query-votes-by-voter" className={styles.box}>
      <div className={styles.boxHeader}>
        <h2>
          {"QueryVotesByVoter"}
        </h2>
        <p>
          {"query votes by the address of a voter"}
        </p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <InputAddress
          id="query-votes-by-voter-voter"
          label="voter"
          network={network}
          address={voter}
          setAddress={setVoter}
        />
        <button type="submit">
          {"search"}
        </button>
      </form>
      <Result
        error={error}
        success={success}
      />
    </div>
  )
}

export default QueryVotesByVoter
