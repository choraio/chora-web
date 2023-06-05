import * as React from "react"
import { useContext, useState } from "react"

import { WalletContext } from "chora"

import InputString from "chora/components/InputString"
import Result from "chora/components/Result"

import * as styles from "./QueryCreditType.module.css"

const queryCreditType = "/regen/ecocredit/v1/credit-type"

const QueryCreditType = () => {

  const { chainInfo } = useContext(WalletContext)

  // form input
  const [abbrev, setAbbrev] = useState<string>("")

  // error and success
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setError("")
    setSuccess("")

    fetch(chainInfo.rest + queryCreditType + "/" + abbrev)
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
    <div id="query-credit-type" className={styles.box}>
      <div className={styles.boxHeader}>
        <h2>
          {"QueryCreditType"}
        </h2>
        <p>
          {"query credit class issuers by credit class id"}
        </p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <InputString
          id="query-credit-type-abbreviation"
          label="abbreviation"
          placeholder="C"
          string={abbrev}
          setString={setAbbrev}
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

export default QueryCreditType
