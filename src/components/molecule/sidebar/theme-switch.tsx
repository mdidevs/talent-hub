import { Monitor, Moon, Sun } from "lucide-react"

import { Button } from "../../atomic/button"

import { useTheme } from "../../../styles/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="p-0.5 border border-stroke-soft-200 rounded-full">
        <Button variant={"tertiary"} onClick={() => setTheme("system")} className={`${ theme === 'system'? 'bg-primary-alpha-16 text-primary-base': 'bg-transparent'} h-7 w-7 rounded-full`}><Monitor/></Button>
        <Button variant={"tertiary"} onClick={() => setTheme("light")} className={`${ theme === 'light'? 'bg-primary-alpha-16 text-primary-base': 'bg-transparent'} h-7 w-7 rounded-full`}><Sun/></Button>
        <Button variant={"tertiary"} onClick={() => setTheme("dark")} className={`${ theme === 'dark'? 'bg-primary-alpha-16 text-primary-base': 'bg-transparent'} h-7 w-7 rounded-full`}><Moon/></Button>
    </div>
  )
}