'use client'

import * as React from 'react'
import { useContext, useEffect, useState } from 'react'

import { ThemeContext, MenuContext, WalletContext } from '../contexts'
import { cachedNetworkKey, defaultNetwork } from '../contexts/WalletContext'
import { HeaderTitle, ThemeButton, UserButton } from '.'
import { SelectNetwork } from './forms'

import styles from './HeaderWallet.module.css'

const HeaderWallet = ({ title, testnets, noUser }: any) => {
  const { darkTheme, setDarkTheme } = useContext(ThemeContext)
  const { showUser, setShowUser } = useContext(MenuContext)
  const { network, setNetwork, wallet, loading } = useContext(WalletContext)

  const [selected, setSelected] = useState<string>('')

  const toggleTheme = () => {
    if (darkTheme) {
      setDarkTheme(false)
    } else {
      setDarkTheme(true)
    }
  }

  const toggleUser = () => {
    if (showUser) {
      setShowUser(false)
    } else {
      setShowUser(true)
    }
  }

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      if (loading === true) {
        setSelected(localStorage.getItem(cachedNetworkKey) || defaultNetwork)
      } else if (!wallet) {
        setSelected(network || defaultNetwork)
        localStorage.setItem(cachedNetworkKey, network || defaultNetwork)
      } else {
        setSelected(network || defaultNetwork)
        localStorage.setItem(cachedNetworkKey, network || defaultNetwork)
      }
    }
  }, [network, wallet, loading])

  return (
    <div className={styles.header}>
      <div>
        <HeaderTitle darkTheme={darkTheme} title={title} />
        <div className={styles.menu}>
          <form className={styles.form}>
            <SelectNetwork
              label=" "
              network={network}
              selected={selected}
              setNetwork={setNetwork}
              testnets={testnets}
            />
          </form>
          {!noUser && (
            <UserButton darkTheme={darkTheme} toggleUser={toggleUser} />
          )}
          <ThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </div>
  )
}

export default HeaderWallet
