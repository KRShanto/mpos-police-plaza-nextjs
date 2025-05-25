import Image from "next/image";
import { Bell } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="h-16 bg-bg-secondary flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
            <Image
              src="/placeholder-avatar.jpg"
              alt="Profile"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-medium">Fahim Ahmed</div>
            <div className="text-sm text-gray-500">Admin</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
