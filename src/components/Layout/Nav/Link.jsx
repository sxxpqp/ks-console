import React from 'react'
import { Link } from 'react-router-dom'

export default function NavLink(props) {
  if (props.disabled) {
    return <a {...props} />
  }

  return <Link {...props} />
}
