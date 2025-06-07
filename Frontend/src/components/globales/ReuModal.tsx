import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface ReusableModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;

}

export default function ReuModal({
  isOpen,
  onOpenChange,
  title,
  children,
  onConfirm,
  size = "md",
  confirmText = "Confirmar",
  cancelText = "Cerrar",
}: ReusableModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      size={size}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                {cancelText}
              </Button>
              {onConfirm && (
                <Button
                  color="primary"
                  onPress={() => {
                    onConfirm();
                    onClose();
                  }}
                >
                  {confirmText}
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}