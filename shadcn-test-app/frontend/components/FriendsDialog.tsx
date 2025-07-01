'use client'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { z } from "zod";


import { useState } from "react";

const AddFriendsPage = () => {
  return(
    <div>
     <Input placeholder="Search by username..."/> 
    </div>
  )
}

const RequestsPage = () => {
  return(
    <div>Requests Page</div>
  )
}

const OutgoingPage = () => {
  return(
    <div>Outgoing Page</div>
  )
}

export default function FriendsDialog(){
  const [page, setPage] = useState(0);

  return(
    <Dialog>
    <DialogTrigger asChild>
      <Button className="ml-auto mr-2 select-none">Add Friends</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="sr-only">Add Friends</DialogTitle> 
        <div className="flex space-x-2">
          <Button variant='outline' className={`w-fit ${page == 0 && 'bg-gray-100'}`} onClick={() => setPage(0)}>Add Friends</Button>
          <Button variant='outline' className={`w-fit ${page == 1 && 'bg-gray-100'}`} onClick={() => setPage(1)}>Requests</Button>
          <Button variant='outline' className={`w-fit ${page == 2 && 'bg-gray-100'}`} onClick={() => setPage(2)}>Outgoing</Button>
        </div>
      </DialogHeader>
      {page == 0 && <AddFriendsPage />}
      {page == 1 && <RequestsPage />}
      {page == 2 && <OutgoingPage />}

       
    </DialogContent>
  </Dialog>

  )
}
