import React, { Component } from 'react'
import { get, isEmpty } from 'lodash'

import { Checkbox, Tag, Notify } from '@kube-design/components'
import { Text } from 'components/Base'

import styles from './index.scss'

export default class CheckItem extends Component {
  handleCheck = () => {
    const { roleTemplates, roleTemplatesMap, data, onChange } = this.props

    let newTemplates = [...roleTemplates]
    if (newTemplates.includes(data.name)) {
      const relateTemplates = newTemplates.filter(
        template =>
          template !== data.name &&
          this.getDependencies([template]).includes(data.name)
      )
      if (relateTemplates.length === 0) {
        newTemplates = newTemplates.filter(item => item !== data.name)
      } else {
        Notify.warning(
          t(
            relateTemplates.length === 1
              ? 'RULE_RELATED_WITH'
              : 'RULE_RELATED_WITH_PLURAL',
            {
              resource: relateTemplates
                .map(rt => t(get(roleTemplatesMap, `[${rt}].aliasName`)))
                .join(', '),
            }
          )
        )
      }
    } else {
      newTemplates.push(data.name)
    }

    onChange([...newTemplates, ...this.getDependencies(newTemplates)])
  }

  getDependencies = names => {
    const { roleTemplatesMap } = this.props
    const dependencies = []

    if (isEmpty(names)) {
      return dependencies
    }

    names.forEach(name => {
      const template = roleTemplatesMap[name]
      if (template.dependencies) {
        template.dependencies.forEach(dep => {
          if (!names.includes(dep) && !dependencies.includes(dep)) {
            dependencies.push(dep)
          }
        })
      }
    })

    if (dependencies.length > 0) {
      dependencies.push(...this.getDependencies(dependencies))
    }

    return dependencies
  }

  render() {
    const { roleTemplates, roleTemplatesMap, data } = this.props

    return (
      <div className={styles.checkItem}>
        <Checkbox
          checked={roleTemplates.includes(data.name)}
          onClick={this.handleCheck}
        />
        <Text
          title={t(data.aliasName)}
          onClick={this.handleCheck}
          description={t(
            `${data.aliasName.toUpperCase().replace(/\s+/g, '_')}_DESC`
          )}
        />
        {data.dependencies.length > 0 && (
          <div className={styles.extra}>
            {t('Depend on')}:{' '}
            {data.dependencies.map(item => (
              <Tag className={styles.tag} type="info" key={item}>
                {t(get(roleTemplatesMap, `[${item}].aliasName`))}
              </Tag>
            ))}
          </div>
        )}
      </div>
    )
  }
}
