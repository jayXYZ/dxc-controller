import { DataContext } from "@/lib/contexts/DataContext";
import { useContext } from "react";

function Overlay2() {
    const { data } = useContext(DataContext);

    return (
        <div className='text-[#fff]'>
            <div className='h-[200px] absolute bottom-0 min-w-full text-center'>
                <div className='pt-[35px] text-[48px]'>
                    {data?.commentators ?? 'N/A'}
                </div>
                <div className='text-[#C6AD65] text-[32px]'>
                    {data?.event ?? 'N/A'}
                </div>
            </div>
        </div>
    );
}

export default Overlay2;