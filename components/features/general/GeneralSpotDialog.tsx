"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGeneralSpotStore } from "@/stores/generalSpotStore";
import MenuCard from "@/components/features/general/components/menu/MenuCard";

export default function GeneralSpotDialog() {
  const action = useGeneralSpotStore((a) => a.action);
  const selectedSpot = useGeneralSpotStore((s) => s.selectedSpot);
  const clearSpot = useGeneralSpotStore((c) => c.clearSpot);

  return (
    <Dialog
      open={action === "MENU_CARD"}
      onOpenChange={(open) => {
        if (!open) clearSpot();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="
          fixed
          inset-0
          z-50
          w-screen
          h-screen
          max-w-none
          translate-x-0
          translate-y-0
          p-0
          border-0
          bg-transparent
          shadow-none
          flex
          items-center
          justify-center
        "
      >
        {selectedSpot && (
          <MenuCard spot={selectedSpot} onClose={clearSpot} />
        )}
      </DialogContent>
    </Dialog>
  );
}
