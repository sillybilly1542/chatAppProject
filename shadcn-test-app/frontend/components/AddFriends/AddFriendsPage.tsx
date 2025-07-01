import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useState } from "react";
import { Gabarito } from "next/font/google";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const formSchema = z.object({
  username: z
    .string()
    .max(100, { message: "Please enter less than 100 characters!" })
    .regex(/^[^\p{Extended_Pictographic}]*$/u, {
      message: "Please don't enter emojis!",
    }),
});

type user = {
  username: string;
  id: number;
  status: "none" | "received" | "sent" | "friends";
};

export default function AddFriendsPage() {
  const [users, setUsers] = useState<user[] | null | 0>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.username.length == 0) return;
    const result = await axios.get(
      `http://localhost:8000/api/search/${values.username}`,
      { withCredentials: true },
    );

    if (result.data.users.length == 0) {
      setUsers(0);
      console.log(result.data.users);
    } else {
      setUsers(result.data.users);
      console.log(result.data.users);
    }
  }

  async function handleClick(status: user["status"], id: number) {
    if (status === "sent" || status === "friends") return;

    let newStatus: user["status"] = status;
    if (status === "none") {
      await axios.post(
        "http://localhost:8000/api/create-request",
        { id: id },
        { withCredentials: true },
      );
      newStatus = "sent";
    } else if (status === "received") {
      await axios.post(
        "http://localhost:8000/api/create-friendship",
        { id: id },
        { withCredentials: true },
      );
      newStatus = "friends";
    }

    setUsers((prevUsers) => {
      console.log("setUsers called", prevUsers);
      if (prevUsers === null || prevUsers === 0) return prevUsers;
      return prevUsers.map((user) =>
        user.id === id ? { ...user, status: newStatus } : user,
      );
    });
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-2 flex">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    placeholder="Search by username..."
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button>Search</Button>
        </form>
      </Form>
      {users != null && (
        <div>
          {users == 0 ? (
            <h1
              className={`${gabarito.className} text-center mt-2 text-gray-500`}
            >
              We couldn't find any users that matched your search.
            </h1>
          ) : (
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
                    {users.map((user) => (
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
                            className={`w-full`}
                            onClick={() => handleClick(user.status, user.id)}
                          >
                            {user.status == "none" && "Add Friend"}
                            {user.status == "sent" && "Pending"}
                            {user.status == "received" && "Accept Request"}
                            {user.status == "friends" && "You Are Friends"}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
    </div>
  );
}
