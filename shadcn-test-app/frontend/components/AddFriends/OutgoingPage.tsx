import { useState, useEffect } from "react"
import axios from "axios"
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "../ui/scroll-area";
import { Gabarito } from "next/font/google";

const gabarito = Gabarito({
  subsets: ['latin'], 
  weight: ['500', '700']
})

type user = {
  id: number;
  username: string;
}

export default function OutgoingPage(){
  const [data, setData] = useState<user[] | null>(null);

  const fetch = async () => {
    const result = await axios.get("http://localhost:8000/api/fetch-outgoing", {withCredentials: true});
    if(result.data.success){
      setData(result.data.data)
      console.log(result.data.data)
    }
  }

  useEffect(() => {
    fetch();
  }, [])

  const handleClick = async (id: number) => {
    await axios.delete(`http://localhost:8000/api/cancel-request/${id}`, {withCredentials: true})
    fetch();
  }
  
  return(
    <div>
      {data && 
        <div>
          <AnimatePresence>
            <motion.div
              key="scroll-area"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5 }}
            >
              <ScrollArea className="h-80 w-full pt-2">
                <div className="grid grid-cols-2 gap-2">
                  {data.map((user) => (
                    <Card key={user.id} className="p-2">
                      <div className="flex flex-col items-center space-y-1">
                        <div className="rounded-full flex justify-center items-center w-10 h-10 bg-gray-300 border-2 border-gray-500">
                          <span className="font-bold text-xl">
                            {user.username[0].toUpperCase()}
                          </span>
                        </div>
                        <h1 className={`${gabarito.className}`}>
                          {user.username}
                        </h1>
                        <Button
                          className={`w-full bg-gray-400 hover:bg-gray-400`}
                          onClick={() => handleClick(user.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          </AnimatePresence>
        </div>
      } 
    </div>
  )
}
