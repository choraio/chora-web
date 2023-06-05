
import * as React from "react"
import { useContext, useState } from "react"

import { WalletContext } from "chora"

import InputAddress from "chora/components/InputAddress"
import InputNumber from "chora/components/InputNumber"
import Result from "chora/components/Result"

import * as styles from "./QueryVoteByProposalVoter.module.css"

const queryVotesByProposalVoter = "/cosmos/group/v1/vote_by_proposal_voter"

const QueryVoteByProposalVoter = () => {

  const { chainInfo, network } = useContext(WalletContext)

  // form input
  const [proposalId, setProposalId] = useState<string>("")
  const [voter, setVoter] = useState<string>("")

  // error and success
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setError("")
    setSuccess("")

    fetch(chainInfo.rest + queryVotesByProposalVoter + "/" + proposalId + "/" + voter)
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
    <div id="query-vote-by-proposal-voter" className={styles.box}>
      <div className={styles.boxHeader}>
        <h2>
          {"QueryVoteByProposalVoter"}
        </h2>
        <p>
          {"query vote by a proposal id and the address of a voter"}
        </p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <InputNumber
          id="query-vote-by-proposal-voter-proposal-id"
          label="proposal id"
          number={proposalId}
          setNumber={setProposalId}
        />
        <InputAddress
          id="query-vote-by-proposal-voter-voter"
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

export default QueryVoteByProposalVoter
