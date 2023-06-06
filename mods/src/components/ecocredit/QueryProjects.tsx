import * as React from "react"
import { useContext, useState } from "react"

import { WalletContext } from "chora"
import { Result } from "chora/components"

import * as styles from "./QueryProjects.module.css"

const queryProjects = "/regen/ecocredit/v1/projects"

const QueryProjects = () => {

  const { chainInfo } = useContext(WalletContext)

  // error and success
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setError("")
    setSuccess("")

    fetch(chainInfo.rest + queryProjects)
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
    <div id="query-projects" className={styles.box}>
      <div className={styles.boxHeader}>
        <h2>
          {"QueryProjects"}
        </h2>
        <p>
          {"query all projects"}
        </p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
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

export default QueryProjects
