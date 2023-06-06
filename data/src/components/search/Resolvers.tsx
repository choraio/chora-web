import * as React from "react"
import { useContext, useState } from "react"

import { WalletContext } from "chora"
import { InputIRI, InputURL, Result } from "chora/components"
import { InputContentHashJSON } from "chora/components/data"

import * as styles from "./Resolvers.module.css"

const queryResolversByHash = "/regen/data/v1/resolvers-by-hash"
const queryResolversByIRI = "/regen/data/v1/resolvers-by-iri"
const queryResolversByURL = "/regen/data/v1/resolvers-by-url"

const Resolvers = () => {
  const { chainInfo } = useContext(WalletContext)

  // input and options
  const [input, setInput] = useState<string>("")
  const [option, setOption] = useState<string>("iri")

  // error and success
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const handleSubmit = (event) => {
    event.preventDefault()

    let query: string
    switch (query) {
        case "hash":
            query = queryResolversByHash
            break
        case "iri":
            query = queryResolversByIRI
            break
        case "url":
            query = queryResolversByURL
            break
    }

    fetch(chainInfo.rest + "/" + query + "/" + input)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setSuccess(JSON.stringify(data, null, "  "))
        }
      })
      .catch(err => {
        setError(err.message)
      })
  }

  if (chainInfo === undefined) {
      return <>loading</>
  }

  return (
    <div className={styles.box}>
      <div className={styles.boxHeader}>
        <h2>
          {"data resolvers"}
        </h2>
        <p>
          {`search data resolvers on ${chainInfo.chainId}`}
        </p>
      </div>
      <div className={styles.boxOptions}>
        <button
          className={option === "iri" ? styles.boxOptionActive : null}
          onClick={() => setOption("iri")}
        >
          {"iri"}
        </button>
        <button
          className={option === "hash" ? styles.boxOptionActive : null}
          onClick={() => setOption("hash")}
        >
          {"hash"}
        </button>
        <button
          className={option === "url" ? styles.boxOptionActive : null}
          onClick={() => setOption("url")}
        >
          {"url"}
        </button>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        {option === "iri" && (
          <InputIRI
            id="resolvers-by-iri"
            label=""
            placeholder=""
            network={chainInfo.chainId}
            string={input}
            setIri={setInput}
          />
        )}
        {option === "hash" && (
          <InputContentHashJSON
            id="resolvers-by-hash"
            label=""
            placeholder=""
            network={chainInfo.chainId}
            contentHash={input}
            setContentHash={setInput}
          />
        )}
        {option === "url" && (
          <InputURL
            id="resolvers-by-url"
            label=""
            placeholder=""
            network={chainInfo.chainId}
            contentHash={input}
            setContentHash={setInput}
          />
        )}
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

export default Resolvers
