import React, { Component } from 'react'
// import { isEmpty } from 'lodash'
import Tr from './Tr'
import Td from './Td'
import TableContext from './context'

export default class Tbody extends Component {
  render() {
    return (
      <TableContext.Consumer>
        {({
          dataSource,
          columns,
          rowKey,
          rowSelection,
          expandedRowRender,
          defaultExpandAllRows,
        }) => (
          <tbody>
            {dataSource.map(item => (
              <Tr
                key={item[rowKey]}
                record={item}
                rowKey={rowKey}
                columns={columns}
                rowKeyData={item[rowKey]}
                rowSelection={rowSelection}
                expandedRowRender={expandedRowRender}
                defaultExpandAllRows={defaultExpandAllRows}
              >
                {column => (
                  <Td
                    key={column.key || column.dataIndex}
                    column={column}
                    record={item}
                  />
                )}
              </Tr>
            ))}
          </tbody>
        )}
      </TableContext.Consumer>
    )
  }
}
