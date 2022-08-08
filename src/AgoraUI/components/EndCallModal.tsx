import { FC } from "react";
import { Button } from "react-bootstrap";
import styles from "styles/Agora.module.scss";

interface IAgoraEndCallModal {
  show: boolean;
  onConfirm: () => void;
  onReject: () => void;
}

export const EndCallModal: FC<IAgoraEndCallModal> = ({
  show = false,
  onConfirm,
  onReject,
}) => {
  return (
    <>
      <div className={`${styles.endCallModal} ${show ? styles.show : ""}`}>
        <h4>¿Seguro que quieres finalizar la llamada?</h4>
        <div className={styles.endCallButtons}>
          <Button onClick={onConfirm}>Sí</Button>
          <Button onClick={onReject}>No</Button>
        </div>
      </div>
    </>
  );
};
