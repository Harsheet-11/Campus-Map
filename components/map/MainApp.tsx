'use client'

import AppDialog from "@/components/bgDialog/AppDialog"
import ProfileIcon from "@/components/profile/ProfileIcon"
import ProfileLoader from "@/components/profile/ProfileLoader"
import ProfileSetupManager from "@/components/profile/ProfileSetupManager"

export default function MainApp() {
  return <>
  <div className="text-balck">
    book my show
  </div>

  <ProfileLoader />
<ProfileSetupManager />
<AppDialog />
<ProfileIcon />
  </>
}
