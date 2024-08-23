
import toast, { Toaster } from "react-hot-toast";
import Avatar from 'react-avatar';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const People = (props) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { roomId } = state
  const leaveRoom = () => {
    navigate("/")
  }
  const copyId = async () => {
    toast.remove()
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Copied");
    } catch (error) {
      toast.error("Failed")
    }
  }
  return (
    <div className='bg-slate-900 h-[100vh]'>
      <div className='flex items-center justify-center'>
        <div className='absolute bottom-1 m-2'>
          <div className='m-2 flex flex-col'>
            <ul className="flex justify-between items-center flex-wrap gap-3">
              {props.users.map(element => (
                <li className="flex flex-col justify-center items-center gap-1" key={element.socketId}>
                  <Avatar name={element.username} size="50" round="30%" />
                  <span className='text-slate-100 text-[13px] mt-1 font-bold flex flex-wrap'>{element.username}</span>
                </li>
              ))}


            </ul>
          </div>
          <button className='bg-green-500 border-0 hover:bg-green-600 rounded-[3px] p-[5px] text-[10px] w-[50px] m-2' onClick={copyId}>Copy Id</button>
          <button className='bg-green-500 border-0 hover:bg-green-600 rounded-[3px] p-[5px] text-[10px] w-[50px] m-2' onClick={leaveRoom}>Leave</button>
        </div>
      </div>
    </div>
  );
}

export default People;
