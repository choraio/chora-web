import * as React from "react"
import { useContext, useState } from "react"

import { WalletContext } from "../../contexts/WalletContext"

import InputIRI from "../InputIRI"
import Result from "../Result"
import SelectNetwork from "../SelectNetwork"

import * as styles from "./QueryAttestationsByIRI.module.css"

const queryAttestationsByIRI = "/regen/data/v1/attestations-by-iri"

const QueryAttestationsByIRI = () => {

  const { chainInfo } = useContext(WalletContext)

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
    <>
      <div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <InputIRI
            iri={iri}
            setIri={setIri}
          />
          <SelectNetwork withLabel={true} />
          <button type="submit">
            {"search"}
          </button>
        </form>
      </div>
      <Result
        error={error}
        success={success}
      />
    </>
  )
}

export default QueryAttestationsByIRI
