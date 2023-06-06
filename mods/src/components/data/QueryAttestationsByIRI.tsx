import * as React from "react"
import { useContext, useState } from "react"

import { WalletContext } from "chora"
import { InputIRI, Result } from "chora/components"

import * as styles from "./QueryAttestationsByIRI.module.css"

const queryAttestationsByIRI = "/regen/data/v1/attestations-by-iri"

const QueryAttestationsByIRI = () => {

  const { chainInfo, network } = useContext(WalletContext)

  const [iri, setIri] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setError("")
    setSuccess("")

    fetch(chainInfo.rest + queryAttestationsByIRI + "/" + iri)
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
    <div id="query-attestations-by-iri" className={styles.box}>
      <div className={styles.boxHeader}>
        <h2>
          {"QueryAttestationsByIRI"}
        </h2>
        <p>
          {"query data attestations by the iri of the data"}
        </p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <InputIRI
          network={network}
          iri={iri}
          setIri={setIri}
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

export default QueryAttestationsByIRI
