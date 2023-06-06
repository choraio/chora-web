import * as React from "react"
import { Link } from "gatsby"

import { ThemeButton } from "chora/components"

import choraLogoDark from "chora/assets/images/chora_dark_icon.png"
import choraLogoLight from "chora/assets/images/chora_light_icon.png"

import * as styles from "./Header.module.css"

const Header = ({ darkTheme, toggleTheme }) => {

  let local = false
  if (typeof window !== "undefined" && (
      window.location.hostname == "0.0.0.0" ||
      window.location.hostname == "127.0.0.1" ||
      window.location.hostname == "localhost"
    )
  ) { local = true }

  return (
    <div className={styles.header}>
      <div>
        <div className={styles.title}>
          <Link to="/">
            <img src={darkTheme ? choraLogoDark : choraLogoLight} />
            <div>
              {"chora"}
            </div>
          </Link>
        </div>
        <div className={styles.menu}>
          {local ? (
            <ul>
              <li>
                <Link to={"http://" + window.location.hostname + ":8001"}>
                  {"coop"}
                </Link>
              </li>
              <li>
                <Link to={"http://" + window.location.hostname + ":8002"}>
                  {"data"}
                </Link>
              </li>
              <li>
                <Link to={"http://" + window.location.hostname + ":8003"}>
                  {"mods"}
                </Link>
              </li>
              <li>
                <Link to={"http://" + window.location.hostname + ":8004"}>
                  {"scan"}
                </Link>
              </li>
              <li className={styles.divider}>
                {'|'}
              </li>
              <li>
                <Link to="https://docs.chora.io" target="_blank">
                  {"docs"}
                </Link>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <Link to="/coop">
                  {"coop"}
                </Link>
              </li>
              <li>
                <Link to="/data">
                  {"data"}
                </Link>
              </li>
              <li>
                <Link to="/mods">
                  {"mods"}
                </Link>
              </li>
              <li>
                <Link to="/scan">
                  {"scan"}
                </Link>
              </li>
              <li className={styles.divider}>
                {'|'}
              </li>
              <li>
                <Link to="https://docs.chora.io" target="_blank">
                  {"docs"}
                </Link>
              </li>
            </ul>
          )}
          <ThemeButton
            darkTheme={darkTheme}
            toggleTheme={toggleTheme}
          />
        </div>
      </div>
    </div>
  )
}

export default Header
