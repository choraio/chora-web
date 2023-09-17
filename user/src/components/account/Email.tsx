import * as React from "react"
import { useContext, useEffect, useState } from "react"

import { AuthContext, WalletContext } from "chora"
import { InputString, Result } from "chora/components"
import { useNetworkServer } from "chora/hooks/useNetworkServer"

import * as styles from "./Email.module.css"

const Email = () => {

  const { authUser, checkAuthToken, getAuthToken, setAuthToken, setAuthUser } = useContext(AuthContext)
  const { chainInfo } = useContext(WalletContext)

  const [serverUrl] = useNetworkServer(chainInfo)

  // form input
  const [email, setEmail] = useState<string>("")
  const [accessCode, setAccessCode] = useState<string>("")

  // authentication error
  const [error, setError] = useState<string | undefined>(undefined)

  // check authenticated on load
  useEffect(() => {
    if (serverUrl) {
      checkAuthToken(serverUrl)
    }
  }, [serverUrl]);

  // authenticate user with email and access code
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    setError("")

    // get authentication token
    const token = getAuthToken()

    // authenticate user with email and access code
    await fetch(serverUrl + "/auth/email", {
      method: "POST",
      body: JSON.stringify({
        token,
        email,
        accessCode,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.code) {
          setError(data.message)
        } else if (data.error) {
          setError(data.error)
        } else {
          setAuthToken(data.token)
          setAuthUser(data.user)
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
          {"email access code authentication"}
        </h2>
        <p>
          {"authenticate user with email access code"}
        </p>
      </div>
        <div className={styles.boxItem}>
          <div className={styles.boxText}>
            <h3>
              {"connected"}
            </h3>
            <p>
              {authUser && authUser.email ? "true" : "false"}
            </p>
          </div>
        {(!authUser || (authUser && !authUser.email)) ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <InputString
              id="email"
              label="email"
              string={email}
              setString={setEmail}
            />
            <InputString
              id="access-code"
              label="access code"
              string="access code"
              disabled // TODO: access code input
            />
            <button className={styles.button} type="submit">
              {"authenticate"}
            </button>
          </form>
        ) : (
          <div className={styles.boxText}>
            <h3>
              {"email"}
            </h3>
            <p>
              {authUser && authUser.email}
            </p>
          </div>
        )}
      </div>
      <Result error={error} />
    </div>
  )
}

export default Email
