import React from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/mode-groovy'
import 'ace-builds/src-noconflict/theme-chaos'
import 'ace-builds/src-noconflict/keybinding-vscode'
import 'ace-builds/src-noconflict/ext-searchbox'

import './custom.css'

export default class AceEditorWrapper extends React.Component {
  render() {
    return (
      <AceEditor
        theme="chaos"
        width="auto"
        height="100%"
        tabSize={2}
        editorProps={{ $blockScrolling: true }}
        showPrintMargin={false}
        keyboardHandler="vscode"
        wrapEnabled
        {...this.props}
      />
    )
  }
}
