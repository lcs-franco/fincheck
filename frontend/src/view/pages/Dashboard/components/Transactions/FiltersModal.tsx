import { Modal } from '../../../../components/Modal';

interface FiltersModalProps {
  open: boolean;
  onClose(): void;
}

export function FiltersModal({ onClose, open }: FiltersModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Filtros">
      Filtros...
    </Modal>
  );
}
