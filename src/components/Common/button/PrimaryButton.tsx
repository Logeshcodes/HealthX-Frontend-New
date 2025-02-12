import { ReactElement } from "react";


export default function PrimaryButton({ name ,type="button" }: {
    name: string,
    type?:"button" | "submit" | "reset" 
}): ReactElement {
    return <button type={type} className="text-white hover:text-purple-700 ml-44
    h-10  
     bg-purple-700 hover:bg-purple-300
      py-2 px-3 rounded-full     
     shadow-[5px_5px_0px_0px_rgba(216,180,254)] 
     hover:shadow-[5px_5px_0px_0px_rgba(88,22,135)] 
        hover:translate-x-1 transition-all ease-in-out duration-300">
            {name}
            </button>
}