"use client"
import Image from 'next/image';

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logout } from '@/actions/logout';
import { UserButton } from '@/components/auth/userButton';

const Header = () => {

  const user =  useCurrentUser();
  const onClick = () => {
    logout()
  }

  return (
    <div className="p-4 shadow-5m border flex justify-end">
      <div className="">
        <p><UserButton /> </p>
      </div>
    </div>
  )
}

export default Header