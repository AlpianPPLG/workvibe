"use client"

import { Bell, Search, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTheme } from "next-themes"
import { mockUsers } from "@/lib/mock-data"
import { HeaderSettings } from "./HeaderSettingsComponent"

export function Header() {
  const { setTheme, theme } = useTheme()
  const currentUser = mockUsers[0]

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />

      <div className="flex flex-1 items-center gap-2 px-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search teams, members, tasks..." className="pl-8" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        <HeaderSettings />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium">New team member</p>
                <p className="text-xs text-muted-foreground">John Doe joined your team</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-medium">Task completed</p>
                <p className="text-xs text-muted-foreground">Project kickoff meeting</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-yellow-500" />
              <div>
                <p className="text-sm font-medium">Reminder</p>
                <p className="text-xs text-muted-foreground">Team sync in 30 minutes</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full">
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                {currentUser.name.charAt(0)}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
