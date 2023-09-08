import * as React from "react"
import { useContext, useEffect, useState } from "react"

import { WalletContext } from "chora"
import { choraLocal, choraTestnet } from "chora/chains"

import GroupPolicyPreview from "./PolicyPreview"

import * as styles from "./Policies.module.css"

const groupId = "1" // TODO: configuration file
const queryPolicies = "cosmos/group/v1/group_policies_by_group"

const Policies = () => {

  const { chainInfo, network } = useContext(WalletContext)

  // fetch error and results
  const [error, setError] = useState<string>("")
  const [policies, setPolicies] = useState<any>(null)

  // list options
  const [sort, setSort] = useState<string>("ascending")

  // whether network is supported by coop app
  const coopChain = (
    network === choraTestnet.chainId ||
    network === choraLocal.chainId
  )

  // fetch on load and value change
  useEffect(() => {
    setPolicies(null)
    setError("")

    // error if network is not chora-testnet-1 (or chora-local)
    if (!coopChain) {
      setError("switch to chora-testnet-1")
    }

    // fetch policies if network is chora-testnet-1 (or chora-local)
    if (coopChain) {
      fetchPolicies().catch(err => {
        setError(err.message)
      })
    }
  }, [chainInfo, network])

  // sort on load and value change
  useEffect(() => {
    const ps = policies ? [...policies] : []

    if (policies && sort === "ascending") {
      ps.sort((a, b) => new Date(b["created_at"]) - new Date(a["created_at"]))
    }

    if (policies && sort === "descending") {
      ps.sort((a, b) => new Date(a["created_at"]) - new Date(b["created_at"]))
    }

    setPolicies(ps)
  }, [sort])

  // fetch policies asynchronously
  const fetchPolicies = async () => {

    // fetch policies from selected network
    await fetch(chainInfo.rest + "/" + queryPolicies + "/" + groupId)
      .then(res => res.json())
      .then(res => {
        if (res.code) {
          setError(res.message)
        } else {
          const ps = res["group_policies"]

         // sort ascending by default
          ps.sort((a, b) => new Date(b["created_at"]) - new Date(a["created_at"]))
          setSort("ascending")

          setPolicies(ps)
        }
      })
  }

  return (
    <div className={styles.box}>
      <div className={styles.boxOptions}>
        {sort === "descending" && (
          <button onClick={() => setSort("ascending")}>
            {"sort by newest"}
          </button>
        )}
        {sort === "ascending" && (
          <button onClick={() => setSort("descending")}>
            {"sort by oldest"}
          </button>
        )}
      </div>
      {!policies && !error && (
        <div>
          {"loading..."}
        </div>
      )}
      {policies && policies.map(policy => (
        <GroupPolicyPreview
          key={policy["address"]}
          policy={policy}
        />
      ))}
      {policies && policies.length === 0 && !error && (
        <div>
          {"no policies found"}
        </div>
      )}
      {error && (
        <div>
          {error}
        </div>
      )}
    </div>
  )
}

export default Policies
