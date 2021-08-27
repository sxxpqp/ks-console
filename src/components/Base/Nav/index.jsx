import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { get } from 'lodash'

import styles from './index.scss'

export default class Nav extends React.Component {
  static propTypes = {
    isDark: PropTypes.bool,
    route: PropTypes.object,
    match: PropTypes.object,
  }

  static defaultProps = {
    isDark: false,
    route: {},
    match: {},
  }

  render() {
    const { className, isDark, route, match } = this.props
    const routes = get(route, 'routes', [])

    return (
      <div
        className={classnames(
          styles.main,
          { [styles.dark]: isDark },
          className
        )}
      >
        {routes.map(({ name, title }) => {
          if (!name) return null

          return (
            <NavLink
              key={name}
              className={styles.item}
              activeClassName={styles.active}
              to={`${match.url}/${name}`}
            >
              {t(title)}
            </NavLink>
          )
        })}
      </div>
    )
  }
}
