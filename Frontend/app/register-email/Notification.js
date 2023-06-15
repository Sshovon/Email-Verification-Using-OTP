import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notification = () => {
  // Helper function to show a success notification
  const showSuccessNotification = () => {
    toast.success('Success!', {
      position: toast.POSITION.BOTTOM_RIGHT
    });
  };

  return (
    <>
      <ToastContainer />
      {/* ...other components */}
    </>
  );
};

export default Notification;
