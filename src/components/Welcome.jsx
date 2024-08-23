import { useEffect, useRef } from "react"
import { v4 } from "uuid"
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const Welcome = () => {
    const roomid = useRef();
    const username = useRef();
    const navigate = useNavigate();
    useEffect(() => {
        roomid.current.focus();
    }, [])
    const joinRoom = () => {
        if (!username.current.value || !roomid.current.value) {
            toast.remove()
            toast.error("Username and ID required", { duration: 1000 })
            return
        }

        navigate("/room/" + roomid.current.value, { state: { roomId: roomid.current.value, username: username.current.value } });
    }
    const newRoom = async () => {
        const id = await v4();
        roomid.current.value = id;
        toast.remove()
        toast.success("Room Created")
        username.current.focus()
    }
    const handleKeys = (e) => {
        if (e.code === "Enter") {
            if (username.current.value && roomid.current.value) {
                joinRoom();
            }
            if (roomid.current.value) {
                username.current.focus();
                return 0;
            }
            roomid.current.focus();
            return 0;
        }
    }

    return (
        <div className="w-[100%] bg-slate-900">
            <div className="h-[100vh] flex items-center justify-center bg-[rgb(11, 0, 57)]">
                <div className="bg-slate-100 p-2 rounded-md w-[400px] max-w-[90%]">
                    <h4 className="mainlabel mb-[20px] mt-0 ml-[5px] text-[15px] font-semibold">Paste your ROOM ID</h4>
                    <div className="inputgroup flex flex-col">
                        <input className="inputbox rounded-[5px] p-[5px] outline-none border-none m-[5px] font-bold text-[12px]" placeholder="ROOM ID" onKeyUp={handleKeys} ref={roomid} onChange={(e) => {
                            roomid.current.value = e.target.value;
                        }} required />
                        <input ref={username} className="invalid:border-x-red-700 rounded-[5px] p-[5px] outline-none border-none m-[5px] font-bold text-[12px]" placeholder="Name" onKeyUp={handleKeys} onChange={(e) => {
                            username.current.value = e.target.value;
                        }} required />
                        <button className="active:bg-green-500 mt-[5px] border-none rounded-[5px] bg-green-400 w-[90px] text-slate-950 text-[15px] font-light ml-auto" onClick={joinRoom}>Join</button>
                        <span className="item-center text-[10px] m-[5px]">If you dont have an room id create <Link className="underline text-blue-600 hover:text-blue-800" to="/" onClick={newRoom}>room now</Link></span>

                    </div>
                </div>
            </div>

            <Toaster
                toastOptions={{
                    position : "top-right",
                    style: {
                        text:'bold',
                        font : 'italic',
                        border: '1px solid #713200',
                        padding: '3px',
                        color: '#713200',
                    },
                }}
            />
        </div>
    )
}
export default Welcome