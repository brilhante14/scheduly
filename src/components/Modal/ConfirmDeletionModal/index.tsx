import "../modal-styles.css";
import "./styles.css";

interface IConfirmDeletionModal {
  handleCloseModal: () => void;
  confirmDeletion: () => void;
}

export function ConfirmDeletionModal({ confirmDeletion, handleCloseModal }: IConfirmDeletionModal) {
  return (
    <div className="modal-container">
      <div className="modal-content">
        <span>Deseja mesmo remover o agendamento?</span>

        <div className="modal-actions">
          <button onClick={handleCloseModal}>Cancelar</button>
          <button type="submit" onClick={confirmDeletion}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}