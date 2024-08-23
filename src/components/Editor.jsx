import Editor from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

const EditorCompo = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    socketRef.current.on("content-changes", async ({ e }) => {
      await editor.setValue(e)
      
    })
    return () => {
      socketRef.current.disconnect()
    }
  };
  const handleChanges = (e, value) => {
    onCodeChange(e);
    if(!(value.isFlush))
      socketRef.current.emit("content-changes", { e, roomId })
  }
  return (
    <>
      <Editor
        width="auto"
        height="100vh"
        theme="vs-dark"
        defaultLanguage="python"
        defaultValue="# some comment"
        onChange={handleChanges}
        onMount={handleEditorDidMount}
      />
    </>
  );
};

export default EditorCompo;
