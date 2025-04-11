/* eslint-disable prettier/prettier */
/* eslint-disable indent */

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <ul className="p-4 space-y-2">
          <li>Accueil</li>
          <li>Profil</li>
          <li>Messages</li>
          <li>Déconnexion</li>
        </ul>
      </SidebarContent>
    </Sidebar>
  )
}
