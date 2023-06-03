import * as React from "react"
import { useContext, useState } from "react"

import { WalletContext } from "chora"

import InputNumber from "chora/components/InputNumber"
import Result from "chora/components/Result"

import * as styles from "./QueryBalancesByVoucher.module.css"

const queryBalancesByVoucher = "/chora/voucher/v1/balances-by-voucher"

const QueryBalancesByVoucher = () => {

  const { chainInfo } = useContext(WalletContext)

  // form input
  const [id, setId] = useState<string>("")

  // error and success
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setError("")
    setSuccess("")

    fetch(chainInfo.rest + queryBalancesByVoucher + "/" + id)
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
    <div className={styles.box}>
      <div className={styles.boxHeader}>
        <h2>
          {"QueryBalancesByVoucher"}
        </h2>
        <p>
          {"query all balances by the id of the voucher"}
        </p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <InputNumber
          id="query-balances-by-voucher-id"
          label="voucher id"
          number={id}
          setNumber={setId}
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

export default QueryBalancesByVoucher
