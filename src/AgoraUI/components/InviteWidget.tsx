import { copyToClipboard } from "AgoraUI/lib/copyToClipboard";
import { useRouter } from "next/router";
import { FC } from "react";
import { Button, CloseButton } from "react-bootstrap";
import { Clipboard2Plus } from "react-bootstrap-icons";
import styles from "styles/Agora.module.scss";
export const InviteWidget: FC<{ setClose: () => void }> = ({ setClose }) => {
  const router = useRouter();
  const url = `${process.env.NEXT_PUBLIC_DOMAIN}${router.asPath}`;

  return (
    <div className={styles.inviteWidget}>
      <CloseButton onClick={setClose} className={styles.closebtn} />

      <p>Invita a otros con el enlace:</p>
      <p>{url}</p>
      <Button onClick={() => copyToClipboard(url)}>
        Copiar
        <Clipboard2Plus height={24} width={24} />
      </Button>
    </div>
  );
};
