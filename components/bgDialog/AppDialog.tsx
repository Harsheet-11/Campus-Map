"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModalStore } from "@/components/stores/modalStore";
import NicknameCard from "@/components/auth/NicknameCard";
import ProfileIcon from "@/components/profile/ProfileIcon";

// ── Per-modal dialog shell config ──────────────────────────────
type ModalDialogConfig = {
  unstyled?: boolean;
  showCloseButton?: boolean;
  className?: string;
};

const MODAL_CONFIG: Record<string, ModalDialogConfig> = {
  "profile-setup": {
    unstyled: true,
    showCloseButton: false,               // NicknameCard owns its × button
    className: "flex items-center justify-center p-4",
  },
  "profile-view": {
    unstyled: false,
    showCloseButton: true,
  },
  "settings": {
    unstyled: false,
    showCloseButton: true,
  },
};

const DEFAULT_CONFIG: ModalDialogConfig = {
  unstyled: false,
  showCloseButton: true,
};

// ──────────────────────────────────────────────────────────────

export default function AppDialog() {
  const modal = useModalStore((state) => state.modal);
  const close = useModalStore((state) => state.close);

  const config = modal ? (MODAL_CONFIG[modal] ?? DEFAULT_CONFIG) : DEFAULT_CONFIG;

  return (
    <Dialog
      open={modal !== null}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContent
        unstyled={config.unstyled}
        showCloseButton={config.showCloseButton}
        className={config.className}
      >
        {modal === "profile-setup" && (
          <NicknameCard onDismiss={close} />
        )}

        {modal === "profile-view" && <ProfileIcon />}

        {modal === "settings" && <div>Settings</div>}
      </DialogContent>
    </Dialog>
  );
}