import * as React from "react"
import { useContext, useState } from "react"

import { WalletContext } from "chora"

import InputAddress from "chora/components/InputAddress"
import Result from "chora/components/Result"

import * as styles from "./QueryProjectsByAdmin.module.css"

const queryProjectsByAdmin = "/regen/ecocredit/v1/projects-by-admin"

const QueryProjectsByAdmin = () => {

  const { chainInfo, network } = useContext(WalletContext)

  // form input
  const [admin, setAdmin] = useState<string>("")

  // error and success
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setError("")
    setSuccess("")

    fetch(chainInfo.rest + queryProjectsByAdmin + "/" + admin)
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
    <div id="query-projects-by-admin" className={styles.box}>
      <div className={styles.boxHeader}>
        <h2>
          {"QueryProjectsByAdmin"}
        </h2>
        <p>
          {"query all projects by the address of the admin"}
        </p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <InputAddress
          id="query-projects-by-admin-admin"
          label="admin"
          network={network}
          address={admin}
          setAddress={setAdmin}
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

export default QueryProjectsByAdmin
