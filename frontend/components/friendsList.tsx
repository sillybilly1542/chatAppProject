import { getColor, getUsername } from '@/utils';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const colorClassMap: Record<string, string> = {
  red: 'bg-red-300',
  blue: 'bg-blue-300',
  green: 'bg-green-200',
  gradient: 'bg-linear-to-r from-red-200 to-blue-200',
  // add more as needed
};

type FriendDetails = {
  id: number;
  username: string;
  color: string;
  message: string;
};

const FriendsList = ({ data }: { data: { friends: number[] } }) => {
  const [friendDetails, setFriendDetails] = useState<FriendDetails[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      const details = await Promise.all(
        data.friends.map(async (id) => {
          const username = await getUsername(id);
          const color = await getColor(id);
          const message = "message";

          console.log(color)
          return {id, username, color, message}
        })
      );
      setFriendDetails(details)
    };

    fetchDetails();
  }, [data.friends]);

  return (
    <>
      {friendDetails.map(({ id, username, color, message }) => (
        <div
          className='rounded-lg m-1 border-black border-2 w-50 h-16 flex cursor-pointer hover:bg-gray-200 transition-colors duration-300'
          key={id}
        >
          <div className='h-full flex items-center'>
            <div className=
              {`border-black border-2 rounded-full w-12 h-12 ml-1 ${colorClassMap[color] || 'bg-gray-300'} flex justify-center items-center`}
            >
              <span className='text-2xl font-bold'>{username[0].toUpperCase()}</span>

            </div>
          </div>
          <div className='flex-1 h-full flex flex-col justify-between'>
            <div className='text-center '>
              {username}
            </div>
            <div className='text-center text-gray-600'>
              {message}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FriendsList;
