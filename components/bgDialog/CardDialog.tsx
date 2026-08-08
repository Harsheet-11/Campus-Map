"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSpotStore } from "@/components/stores/spotStore";
import MenuCard from "@/components/cards/menuCard/MenuCard";

export default function SpotDialog() {
  const action = useSpotStore((s) => s.action);
  const selectedSpot = useSpotStore((s) => s.selectedSpot);
  const clearSpot = useSpotStore((s) => s.clearSpot);

  return (
    <Dialog
      open={action === "MENU_CARD"}
      onOpenChange={(open) => {
        if (!open) clearSpot();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="p-0 border-0 bg-transparent shadow-none max-w-[360px] w-full h-[90vh] max-h-[640px]"
      >
        {selectedSpot && (
          <MenuCard
            key={selectedSpot.id}
            spot={selectedSpot}
            onClose={clearSpot}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}