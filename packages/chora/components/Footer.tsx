'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'

import { ThemeContext } from '../contexts'
import choraLogoDark from '../assets//images/chora_dark_small.png'
import choraLogoLight from '../assets//images/chora_light_small.png'

import styles from './Footer.module.css'

const Footer = ({ lists }: any) => {
  const { darkTheme } = useContext(ThemeContext)

  return (
    <div className={styles.footer}>
      <div style={{ display: 'none' }}>{darkTheme?.toString()}</div>
      <div>
        <div className={styles.title}>
          <Image alt="chora" src={darkTheme ? choraLogoDark : choraLogoLight} />
          <h4>{'© 2023 Chora Studio, LLC'}</h4>
        </div>
        {lists.map((item: any) => (
          <div className={styles.list} key={item.title}>
            <h3>{item.title}</h3>
            <ul>
              {item.items.map((item: any) => (
                <li key={item.title}>
                  <Link href={item.link} target={item.target}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Footer
