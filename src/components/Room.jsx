
import People from "./People";
import EditorCompo from "./Editor";
import { initSocket } from '../socket';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const Room = () => {
  const codeRef = useRef(null);
  const socketRef = useRef(null);
  const [users, setUsers] = useState([])
  const navigate = useNavigate();
  const { state } = useLocation();
  if(state ===  null)handleErrors();
  const { roomId, username } = state
  const handleErrors = (err) => {
    toast.error("Something went wrong")
    navigate('/');
  }
  if(!roomId || !username)handleErrors();
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err))
      socketRef.current.on("connect_failed", (err) => handleErrors(err))
      socketRef.current.emit("join", {
        roomId,
        username
      })
      socketRef.current.on("joined", ({ clients, username, socketId }) => {
        toast.remove()
        toast.success(`${username} joined`)
        
        setUsers(clients)
        socketRef.current.emit("sync-code", {
          
          socketId,
          code : codeRef.current
        })
      })
      
      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast.remove()
        toast.success(`${username} left`)
        setUsers((prev) => {
          return prev.filter(
            (client) => client.socketId !== socketId
          )
        })
      })
    }
    init();
    return () => {
      socketRef.current.disconnect()
      socketRef.current.off("joined")
      socketRef.current.off("disconnected")
    }
  }, [])

  
  return (
    <div className="w-[100%] h-[100vh] flex">
      <div className="w-[15%] h-[100vh] sticky">
        <People users={users} />
      </div>
      <div className="w-[85%] max-w-[85%]">
        <EditorCompo socketRef={socketRef} roomId={roomId} onCodeChange = {(code) => {
          codeRef.current = code
        }} />
      </div>


      <Toaster
        toastOptions={{
          position: "top-right",
          style: {
            text: 'bold',
            font: 'italic',
            border: '1px solid #713200',
            padding: '3px',
            color: '#713200',
          },
        }}
      />
    </div>
  )
}

export default Room