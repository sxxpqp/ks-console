import React from 'react'
import { Link } from 'react-router-dom'

export default function NavLink(props) {
  if (props.disabled) {
    return <a {...props} />
  }
  if (props.link) {
    return (
      <a {...props} href={props.link} target={props.indent ? '_blank' : null}>
        {props.name}
      </a>
    )
  }

  return <Link {...props} />
}
