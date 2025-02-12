import * as React from "react";
import { motion } from "framer-motion";
interface AlertDialogProps {
  children: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
  onConfirm: () => void;
  alert: string;
  title?: string;
}

function AlertDialog2(props: AlertDialogProps) {
  const { children, onConfirm, alert, title  } = props;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <>
      {React.cloneElement(children, { onClick: handleClickOpen })}
      
      {open && (
        <motion.div
        initial={{opacity:0,y:20}}
        animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl text-black font-semibold mb-4">{title}</h2>
            <p className="mb-6 text-gray-600">{alert}</p>
            
            <div className="flex justify-end gap-4">
              <button
              type="button"
                onClick={handleClose}
                className="px-4 py-2 text-black border border-gray-300 rounded hover:bg-gray-100"
              >
                No
              </button>
              <button
              type="button"
                onClick={handleConfirm}
                className="px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700"
              >
                Yes
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default AlertDialog2;