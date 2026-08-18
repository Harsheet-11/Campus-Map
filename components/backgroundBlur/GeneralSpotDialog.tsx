"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGeneralSpotStore } from "@/stores/generalSpotStore";
import MenuCard from "@/components/spots/general/cards/menuCard/MenuCard";

export default function SpotDialog() {
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
        className="p-0 border-0 bg-transparent shadow-none"
      >
        {selectedSpot && (
          <MenuCard spot={selectedSpot} onClose={clearSpot} />
        )}
      </DialogContent>
    </Dialog>
  );
}