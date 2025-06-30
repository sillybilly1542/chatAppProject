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
import { useState } from "react";

import AddFriendsPage from "./AddFriendsPage";
import RequestsPage from "./RequestsPage";
import OutgoingPage from "./OutgoingPage";

export default function FriendsDialog(){
  const [page, setPage] = useState(0);

  return(
    <Dialog>
    <DialogTrigger asChild>
      <Button className="ml-auto mr-2 cursor-pointer select-none">Add Friends</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="sr-only">Add Friends</DialogTitle> 
        <div className="flex space-x-2">
          <Button variant='outline' className={`w-fit cursor-pointer ${page == 0 && 'bg-gray-100'}`} onClick={() => setPage(0)}>Add Friends</Button>
          <Button variant='outline' className={`w-fit cursor-pointer ${page == 1 && 'bg-gray-100'}`} onClick={() => setPage(1)}>Requests</Button>
          <Button variant='outline' className={`w-fit cursor-pointer ${page == 2 && 'bg-gray-100'}`} onClick={() => setPage(2)}>Outgoing</Button>
        </div>
      </DialogHeader>
      {page == 0 && <AddFriendsPage />}
      {page == 1 && <RequestsPage />}
      {page == 2 && <OutgoingPage />}

       
    </DialogContent>
  </Dialog>

  )
}
