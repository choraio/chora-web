import * as React from "react"

import Main from "../../layouts/Main"
import Seo from "../../components/Seo"

import MsgCreate from "../../components/node/MsgCreate"
import MsgUpdate from "../../components/node/MsgUpdate"
import QueryNode from "../../components/node/QueryNode"
import QueryNodeByCurator from "../../components/node/QueryNodeByCurator"

import * as styles from "./index.module.css"

const Create = () => (
  <Main>
    <div className={styles.page}>
      <div>
        <div className={styles.section}>
          <div>
            {"create node"}
          </div>
          <MsgCreate />
        </div>
        <div className={styles.section}>
          <div>
            {"update node"}
          </div>
          <MsgUpdate />
        </div>
        <div className={styles.section}>
          <div>
            {"search node by id"}
          </div>
          <QueryNode />
        </div>
        <div className={styles.section}>
          <div>
            {"search nodes by curator"}
          </div>
          <QueryNodeByCurator />
        </div>
      </div>
    </div>
  </Main>
)

export const Head = () => <Seo title="" />

export default Create
