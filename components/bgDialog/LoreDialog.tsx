"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLoreStore } from "@/components/stores/loreStore";
import LoreSheet from "@/components/spots/lore/LoreSheet";

export default function LoreDialog() {
  const action = useLoreStore((s) => s.action);
  const selectedLore = useLoreStore((s) => s.selectedLore);
  const clearLore = useLoreStore((s) => s.clearLore);

  return (
    <Dialog
      open={action === "LORE_SHEET"}
      onOpenChange={(open) => {
        if (!open) clearLore();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="p-0 border-0 bg-transparent shadow-none"
      >
        {selectedLore && (
          <LoreSheet
            story={selectedLore}
            onClose={clearLore}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}